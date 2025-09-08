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
    if (err) console.error('Error creando tabla products:', err);
  });

  // Tabla del carrito
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
  )`, (err) => {
    if (err) console.error('Error creando tabla cart:', err);
  });

  // Insertar datos de ejemplo si no existen
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error('Error verificando productos:', err);
      return;
    }
    
    if (row && row.count === 0) {
      console.log('Insertando datos iniciales...');
      const initialProducts = [
        ['Gominolas', 1.50, 'https://via.placeholder.com/150?text=Gominolas'],
        ['Chocolate', 2.00, 'https://via.placeholder.com/150?text=Chocolate'],
        ['Caramelo', 0.75, 'https://via.placeholder.com/150?text=Caramelo']
      ];
      
      const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
      initialProducts.forEach(product => {
        stmt.run(product, (err) => {
          if (err) console.error('Error insertando producto:', err);
        });
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizando statement:', err);
        } else {
          console.log('Datos iniciales insertados correctamente');
        }
      });
    }
  });
}

// Rutas de productos
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY id", (err, rows) => {
    if (err) {
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
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Producto eliminado', changes: this.changes });
  });
});

// Rutas del carrito (se mantienen igual)
app.get('/api/cart', (req, res) => {
  const sql = `
    SELECT c.*, p.name, p.price, p.image 
    FROM cart c 
    LEFT JOIN products p ON c.productId = p.id
  `;
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  db.get("SELECT * FROM cart WHERE productId = ?", [productId], (err, row) => {
    if (row) {
      db.run(
        "UPDATE cart SET quantity = quantity + ? WHERE productId = ?",
        [quantity, productId],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Cantidad actualizada' });
        }
      );
    } else {
      db.run(
        "INSERT INTO cart (productId, quantity) VALUES (?, ?)",
        [productId, quantity],
        function(err) {
          if (err) {
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
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item eliminado' });
  });
});

app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  db.run(
    "UPDATE cart SET quantity = ? WHERE id = ?",
    [quantity, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Cantidad actualizada' });
    }
  );
});

// Rutas de pedidos
app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;
  
  // Aquí podrías guardar el pedido en una tabla de orders
  // Por ahora, simplemente vaciamos el carrito
  db.run("DELETE FROM cart", function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Pedido creado y carrito vaciado',
    });
  });
})

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API de Chucherías funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
});