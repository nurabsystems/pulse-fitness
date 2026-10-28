// client/src/pages/Success.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  const [orderStatus, setOrderStatus] = useState("checking");

  // We need to verify the order actually got marked as 'paid' in the DB.
  // Since webhooks can take a few seconds, we'll check a couple of times.
  useEffect(() => {
    if (!orderId) return;

    let attempts = 0;
    const maxAttempts = 5;

    const checkOrder = async () => {
      try {
        // You will need an endpoint to get order status.
        // Replace with your actual backend URL
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "https://pulse-fitness-y1fa.onrender.com/api";
        const res = await fetch(
          `${apiUrl}/orders/${orderId}?session_id=${sessionId}`,
        );
        const data = await res.json();

        if (data.order && data.order.status === "paid") {
          setOrderStatus("paid");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkOrder, 2000); // Check again in 2 seconds
        } else {
          setOrderStatus("pending");
        }
      } catch (err) {
        console.error("Error checking order:", err);
        setOrderStatus("error");
      }
    };

    checkOrder();
  }, [orderId, sessionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        {orderStatus === "checking" && (
          <h1 className="text-2xl font-bold text-white">
            Processing Payment...
          </h1>
        )}

        {orderStatus === "paid" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="mt-2 text-zinc-400">Your membership is now active.</p>
            <p className="mt-1 text-xs text-zinc-500">Order ID: {orderId}</p>
          </>
        )}

        {(orderStatus === "pending" || orderStatus === "error") && (
          <>
            <h1 className="text-2xl font-bold text-yellow-400">
              Payment Processing
            </h1>
            <p className="mt-2 text-zinc-400">
              We received your payment, but the webhook hasn't updated the
              database yet.
            </p>
          </>
        )}

        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
