import api from "./api";

export const createOrder = async (plan) => {

    const { data } = await api.post(
        "/payment/create-order",
        {
            plan
        }
    );

    return data;
};

export const verifyPayment = async (paymentData) => {

    const { data } = await api.post(
        "/payment/verify-payment",
        paymentData
    );

    return data;
};