const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a SQLite
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a SQLite:', err);
  } else {
    console.log('Conectado a SQLite database');
    initDatabase();
  }
});

// Inicializar tablas
function initDatabase() {
  // Tabla de productos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creando tabla products:', err);
      return;
    }
    console.log('Tabla products creada/verificada');
  });

  // Tabla del carrito
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
  )`, (err) => {
    if (err) {
      console.error('Error creando tabla cart:', err);
      return;
    }
    console.log('Tabla cart creada/verificada');
  });

  // Verificar e insertar datos de ejemplo
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error('Error verificando productos:', err);
      return;
    }
    
    // ✅ CORRECCIÓN: row.count (no row.count)
    if (row && row.count === 0) {
      console.log('Insertando datos iniciales...');
      const initialProducts = [
        ['Gominolas', 1.50, 'https://via.placeholder.com/150?text=Gominolas'],
        ['Chocolate', 2.00, 'https://via.placeholder.com/150?text=Chocolate'],
        ['Caramelo', 0.75, 'https://via.placeholder.com/150?text=Caramelo']
      ];
      
      const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
      initialProducts.forEach((product, index) => {
        stmt.run(product, (err) => {
          if (err) {
            console.error('Error insertando producto', index, ':', err);
          }
        });
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizando statement:', err);
        } else {
          console.log('Datos iniciales insertados correctamente');
        }
      });
    } else {
      console.log('Ya existen productos en la base de datos');
    }
  });
}

// Rutas de productos
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.error('Error obteniendo productos:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo producto:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;
  
  if (!name || price === undefined || !image) {
    res.status(400).json({ error: 'Faltan campos requeridos' });
    return;
  }

  db.run(
    "INSERT INTO products (name, price, image) VALUES (?, ?, ?)",
    [name, parseFloat(price), image],
    function(err) {
      if (err) {
        console.error('Error creando producto:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, price: parseFloat(price), image });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) {
      console.error('Error eliminando producto:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Producto eliminado', changes: this.changes });
  });
});

// Rutas del carrito
app.get('/api/cart', (req, res) => {
  const sql = `
    SELECT c.*, p.name, p.price, p.image 
    FROM cart c 
    LEFT JOIN products p ON c.productId = p.id
  `;
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Error obteniendo carrito:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  if (!productId) {
    res.status(400).json({ error: 'productId es requerido' });
    return;
  }

  // Verificar si ya existe
  db.get("SELECT * FROM cart WHERE productId = ?", [productId], (err, row) => {
    if (err) {
      console.error('Error verificando carrito:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (row) {
      // Actualizar cantidad
      const newQuantity = row.quantity + quantity;
      db.run(
        "UPDATE cart SET quantity = ? WHERE productId = ?",
        [newQuantity, productId],
        function(err) {
          if (err) {
            console.error('Error actualizando carrito:', err);
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Cantidad actualizada', changes: this.changes });
        }
      );
    } else {
      // Insertar nuevo
      db.run(
        "INSERT INTO cart (productId, quantity) VALUES (?, ?)",
        [productId, quantity],
        function(err) {
          if (err) {
            console.error('Error añadiendo al carrito:', err);
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID, productId, quantity });
        }
      );
    }
  });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM cart WHERE id = ?", [id], function(err) {
    if (err) {
      console.error('Error eliminando del carrito:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item eliminado', changes: this.changes });
  });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  
  if (quantity < 1) {
    db.run("DELETE FROM cart WHERE id = ?", [id], function(err) {
      if (err) {
        console.error('Error eliminando del carrito:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Item eliminado', changes: this.changes });
    });
  } else {
    db.run(
      "UPDATE cart SET quantity = ? WHERE id = ?",
      [quantity, id],
      function(err) {
        if (err) {
          console.error('Error actualizando cantidad:', err);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Cantidad actualizada', changes: this.changes });
      }
    );
  }
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API de Chucherías funcionando!' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
});

// Cerrar conexión a la base de datos al terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});