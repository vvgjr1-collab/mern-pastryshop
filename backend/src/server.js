import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import productsRoutes from "./routes/productsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import accountsRoutes from "./routes/accountsRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
//console.log(process.env.MONGO_URI);

const app = express(); //expressFunc().("/route",(request,response) => {})
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); // if u console log this it will give path to backend

//middleware: this will parse the JSON bodies from postman/database

if (process.env.NODE_ENV !== "production") {
  app.use(
    //cors should be before rate limiter
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json()); // allowes us to access req.body in routes and controllers
app.use(rateLimiter);

/*  our simple custom middleware

app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

*/

//Endpoint: it is a combination of a URL + HTTP method that lets the client interact with a specific resource
//routes
app.use("/api/products", productsRoutes); //catalogue: same SKUs, two tracks
app.use("/api/orders", ordersRoutes); //ordering: retail carts and wholesale drops
app.use("/api/accounts", accountsRoutes); //wholesale account applications

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
