import React, { useEffect, useState } from 'react';
import dropin from "braintree-web-drop-in";
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
  clientKey: string;
  handlePaypalPayment: (paymentNonce: string) => void;
  loading: boolean;
  totalAmount: number;
}

function PaypalContainer({ clientKey, handlePaypalPayment, loading, totalAmount }: Props) {
  const [braintreeInstance, setBraintreeInstance] = useState<dropin.Dropin>();

  useEffect(() => {
    const initializeBraintree = () => dropin.create({
        authorization: clientKey, 
        container: '#braintree-drop-in-div',
        paypal: {
          amount: totalAmount,
          commit: true,
          currency: 'PHP',
          flow: "checkout",
          buttonStyle: {
            // @ts-expect-error: Let's ignore a compile error like this unreachable code 
            color: 'blue',
            // @ts-expect-error: Let's ignore a compile error like this unreachable code 
            shape: 'rect',
            // @ts-expect-error: Let's ignore a compile error like this unreachable code 
            size: 'large'
          }
        }
    }, function (error, instance) {
        if (error)
            console.error(error)
        else
            setBraintreeInstance(state => instance);
    });


    initializeBraintree();
    

  }, [clientKey, totalAmount])

  return (
    <>
      <div
        id={"braintree-drop-in-div"}
      />

      <LoadingButton
        variant="contained"
        size="large"
        fullWidth
        loading={loading}
        className={"braintreePayButton"}
        disabled={!braintreeInstance}
        sx={{ mt: 2 }}
        onClick={() => {
            if (braintreeInstance) {
                braintreeInstance.requestPaymentMethod(
                    (error, payload) => {
                        if (error) {
                            console.error(error);
                        } else {
                            const paymentMethodNonce = payload.nonce;
                            console.log("payment method nonce", payload.nonce);

                            handlePaypalPayment(paymentMethodNonce);
                        }
                    });
            }
        }}
      >
          {
              "Submit Payment"
          }
      </LoadingButton>
    </>
       
   
  )
}

export default PaypalContainer