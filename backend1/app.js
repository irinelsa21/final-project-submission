const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" })); // to handle base64 images

async function connectDatabases() {
  try {
    // 🔗 Create separate connections
    const buynowConn = await mongoose.createConnection(
      "mongodb+srv://irinelsa21:user@cluster0.qvhc21l.mongodb.net/Buynow?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const userProfileConn = await mongoose.createConnection(
      "mongodb+srv://irinelsa21:user@cluster0.qvhc21l.mongodb.net/userprofile?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log("✅ Connected to both MongoDB databases");

    // 🧾 Order Schema and Model
    const orderSchema = new mongoose.Schema({
      cartItems: [
        {
          title: String,
          image: String,
          price: String,
          color: String,
          size: String,
          quantity: Number,
        },
      ],
      shippingInfo: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        country: String,
      },
      paymentMethod: String,
      paymentDetails: mongoose.Schema.Types.Mixed,
      totalPrice: Number,
      orderDate: { type: Date, default: Date.now },
    });

    const Order = buynowConn.model("Order", orderSchema);

    // 👤 Profile Schema and Model (MUST use userProfileConn)
    const profileSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      profilePic: String,
    });

    const Profile = userProfileConn.model("Profile", profileSchema);

    // ========== ROUTES ==========

    // POST: Place order
    app.post("/orders", async (req, res) => {
      const { cartItems, shippingInfo, paymentMethod, paymentDetails, totalPrice } = req.body;

      let cleanedPaymentDetails = {};
      if (paymentMethod === "UPI") {
        cleanedPaymentDetails = { upi: paymentDetails.upi };
      } else if (paymentMethod === "Card") {
        cleanedPaymentDetails = {
          cardNumber: paymentDetails.cardNumber,
          cardHolder: paymentDetails.cardHolder,
          expiry: paymentDetails.expiry,
          cvv: paymentDetails.cvv,
        };
      } else if (paymentMethod === "COD") {
        cleanedPaymentDetails = { method: "Cash on Delivery" };
      }

      try {
        const order = new Order({
          cartItems,
          shippingInfo,
          paymentMethod,
          paymentDetails: cleanedPaymentDetails,
          totalPrice,
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully." });
      } catch (err) {
        console.error("❌ Error saving order:", err);
        res.status(500).json({ message: "Failed to place order." });
      }
    });

    // GET: Fetch all orders
    app.get("/orders", async (req, res) => {
      try {
        const orders = await Order.find();

        const formattedOrders = orders.map((order) => {
          const paymentInfo = {
            method: order.paymentMethod,
            status: order.paymentMethod === "COD" ? "Pending" : "Paid",
            transactionId:
              order.paymentDetails?.transactionId ||
              order.paymentDetails?.cardNumber?.slice(-4) ||
              order.paymentDetails?.upi ||
              "N/A",
          };

          return {
            ...order._doc,
            id: order._id.toString(),
            paymentInfo,
          };
        });

        res.json(formattedOrders);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        res.status(500).json({ message: "Failed to retrieve orders." });
      }
    });

    // DELETE: Cancel order by ID
    app.delete("/orders/:id", async (req, res) => {
      try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: "Order not found." });
        }
        res.json({ message: "Order canceled successfully." });
      } catch (err) {
        console.error("❌ Failed to cancel order:", err);
        res.status(500).json({ message: "Failed to cancel order." });
      }
    });

    // POST: Save user profile
    app.post("/profiles", async (req, res) => {
      try {
        console.log("Received profile data:", req.body);
        const { name, email, phone, profilePic } = req.body;

        if (!name || !email || !phone) {
          return res.status(400).json({ message: "Missing required fields." });
        }

        const profile = new Profile({ name, email, phone, profilePic });
        await profile.save();
        res.status(200).json({ message: "Profile saved successfully!" });
      } catch (error) {
        console.error("❌ Error saving profile:", error);
        res.status(500).json({ message: "Error saving profile." });
      }
    });

    // 🔁 TEST: Manually trigger a test profile insert
    app.get("/test-profile", async (req, res) => {
      try {
        const profile = new Profile({
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          profilePic: "base64string",
        });
        await profile.save();
        res.json({ message: "Test profile saved to userprofile DB." });
      } catch (err) {
        console.error("❌ Error in test-profile:", err);
        res.status(500).json({ message: "Test profile insert failed." });
      }
    });

    // ✅ Start server
    app.listen(PORT, () => {
      console.log('🚀 Server running on http://localhost:${PORT}');
    });
  } catch (err) {
    console.error("❌ Error connecting to databases:", err);
  }
}

// Connect to DBs and start app
connectDatabases();