const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
var cors = require("cors");

const port = 8080;

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// **************************************************
// *********************products*****************************
// **************************************************
let products = [
  {
    id: "1",
    name: "pc",
    price: 1000,
    totalAmount: 100,
  },
  {
    id: "2",
    name: "mobile",
    price: 500,
    totalAmount: 200,
  },
];
app.get("/api/products", (req, res) => {
  res.json(products);
});
app.post("/api/products", (req, res) => {
  req.body.id = uuidv4();
  products.push(req.body);
  res.json(products);
});
app.put("/api/products/:id", (req, res) => {
  const id = req.params.id;
  let newProducts = products.map((p) => {
    if (p.id === id) {
      return {
        id,
        name: req.body.name,
        price: req.body.price,
        totalAmount: req.body.totalAmount,
      };
    } else {
      return p;
    }
  });
  products = newProducts;
  res.json(newProducts);
});
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  let newProducts = products.filter((p) => p.id !== id);
  products = newProducts;
  res.json(newProducts);
});

// **************************************************
// *********************vendors*****************************
// **************************************************
let vendors = [
  {
    id: "1",
    name: "Claudio",
    lastName: "Quiroz",
    age: 34,
  },
  {
    id: "2",
    name: "nombre prueba",
    lastName: "apellido prueba",
    age: 20,
  },
];
app.get("/api/vendors", (req, res) => {
  res.json(vendors);
});
app.post("/api/vendors", (req, res) => {
  req.body.id = uuidv4();
  vendors.push(req.body);
  res.json(vendors);
});
app.put("/api/vendors/:id", (req, res) => {
  const id = req.params.id;
  let newVendors = vendors.map((v) => {
    if (v.id === id) {
      return {
        id,
        name: req.body.name,
        lastName: req.body.lastName,
        age: req.body.age,
      };
    } else {
      return v;
    }
  });
  vendors = newVendors;
  res.json(newVendors);
});
app.delete("/api/vendors/:id", (req, res) => {
  const id = req.params.id;
  let newVendors = vendors.filter((p) => p.id !== id);
  vendors = newVendors;
  res.json(newVendors);
});

// **************************************************
// *********************inventory*****************************
// **************************************************
let inventory = [
  {
    id: "1",
    vendors: "1",
    products: [{ id: "1", amount: 3 }],
  },
  {
    id: "2",
    vendors: "1",
    products: [
      { id: "1", amount: 3 },
      { id: "2", amount: 4 },
    ],
  },
];
const getInventory = (inventoryProps) => {
  let newInventoryProps = inventoryProps.map((i) => {
    const newVendors = vendors.filter((v) => v.id === i.vendors)[0];
    const newProducts = i.products.map((product) => {
      const newProduct = products.filter((p) => product.id === p.id);
      return { product: newProduct[0], amount: product.amount };
    });
    return {
      id: i.id,
      vendors: newVendors,
      products: newProducts,
    };
  });

  return newInventoryProps;
};
app.get("/api/inventory", (req, res) => {
  res.json(getInventory(inventory));
});
app.post("/api/inventory", (req, res) => {
  req.body.id = uuidv4();
  inventory.push(req.body);
  const productsList = req.body.products;

  productsList.forEach((pList) => {
    console.log("111", pList.id);
    const newProducts = products.map((p) => {
      if (p.id === pList.id && p.totalAmount >= pList.amount) {
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          totalAmount: p.totalAmount - pList.amount,
        };
      }
      return p;
    });
    products = newProducts;
  });

  res.json(getInventory(inventory));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
