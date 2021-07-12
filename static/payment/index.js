var stripe = Stripe("pk_test_51JCUg3KvELx4Sm5hsZduoTWMBghBv5URhepTSx55zH7Bu2Cccnc6dO8r56xzy7TtcYsFyVpbH564ozEihRAWpyLT00pTGCmmv7")

var elem = document.getElementById("submit");
clientSecret = elem.getAttribute("data-secret");

var elements = stripe.elements();
var style = {
    base: {
    color: "#000",
        lineHeight: "2.4",
        fontSize: '16px'
    }
};
var card = elements.create("card", {style});
card.mount("#card-element");

card.on("change", function (event) {
    var displayError = document.getElementById("card-errors")
    if (event.error) {
        displayError.textContent = event.error.message;
        $('#card-errors').addClass('alert alert-info');
    } else {
        displayError.textContent = '';
        $('#card-errors').removeClass('alert alert-info');
    }
});

var form = document.getElementById("payment-form");

form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    var custName = document.getElementById("custName").value;
    var custAdd = document.getElementById("custAdd").value;
    var custAdd2 = document.getElementById("custAdd2").value;
    var postCode = document.getElementById("postCode").value;

    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                address: {
                    line1: custAdd,
                    line2: custAdd2,
                },
                name: custName
            },
        }
    }).then(function (result) {
        if (result.error) {
            console.log("payment error");
            console.log(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log("payment processed")
            //    There's a risk of the customer closing the window before callback
            //    execution. Set up a  webhook or plugin to listen for the
            //    payment_intent.succeeded event that handles any business critical
            //    post-payment actions.
                window.location.replace("http://127.0.0.1:8000/payment/orderplaced/"); // forward the user to this url when the result is succeeded
            }
        }
    })
})