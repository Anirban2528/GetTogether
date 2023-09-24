function showRoomBookingAmount() {
    document.getElementById('room-booking-amount-container').style.display = 'block';
    document.getElementById('room-booking-amount').value = 1500;
    updateTotalAmount();
}

function hideRoomBookingAmount() {
    document.getElementById('room-booking-amount-container').style.display = 'none';
    document.getElementById('room-booking-amount').value = 0;
    updateTotalAmount();
}

function handleRoomBookingAmount() {
    document.getElementById('room-booking-amount-error').style.display = 'none';
    var numBookAmt = document.getElementById('room-booking-amount').value;
    if(!(parseFloat(numBookAmt)>=1500 && parseFloat(numBookAmt)<=1700)){
        document.getElementById('room-booking-amount-error').style.display = 'block';
        return;
    }
    updateTotalAmount();
}

function handleContributionOnPersonChange() {
    document.getElementById('person-error').style.display = 'none';
    var numPerson = document.getElementById('persons').value;
    if(!(parseFloat(numPerson)>0)){
        document.getElementById('person-error').style.display = 'block';
        return;
    }
    document.getElementById('contribution-amount').value = parseFloat(numPerson)*600;
    updateTotalAmount();
}

function handleDonation(){
    document.getElementById('donation-amount-error').style.display = 'none';
    var donationAmt = document.getElementById('donation-amount').value;
    if(!(parseFloat(donationAmt)>=0)){
        document.getElementById('donation-amount-error').style.display = 'block';
        return;
    }
    updateTotalAmount();
}

function updateTotalAmount(){
    document.getElementById('total-amount').value = 0.0;
    var roomBookAmt = parseFloat(document.getElementById('room-booking-amount').value);
    var contributionAmt = parseFloat(document.getElementById('contribution-amount').value);
    var donateAmt = parseFloat(document.getElementById('donation-amount').value);
    document.getElementById('total-amount').value = (roomBookAmt>=1500 ? roomBookAmt : 0.0)
     + (contributionAmt>=600 ? contributionAmt : 0.0)
     + (donateAmt>=0 ? donateAmt : 0.0);
}

function makePayment() {

    updateTotalAmount();
    var totalAmount = parseFloat(document.getElementById('total-amount').value);

    if(totalAmount<600){
        return;
    }

    // Call Razorpay API and redirect to payment gateway
    // Replace 'YOUR_RAZORPAY_API_KEY' with your actual API key
    var razorpayApiKey = 'YOUR_RAZORPAY_API_KEY';
    var options = {
        key: razorpayApiKey,
        amount: totalAmount * 100, // Convert to paise (Indian currency subunit)
        currency: 'INR',
        name: 'Bengali Get-together Sindri',
        description: 'Transaction Note:\n' +
                     'Name: ' + document.getElementById('name').value + '\n' +
                     'Address: ' + document.getElementById('address').value + '\n' +
                     'Phone Number: ' + document.getElementById('phone').value + '\n' +
                     'Number of Persons: ' + document.getElementById('persons').value + '\n' +
                     'Contribution Amount: ' + document.getElementById('contribution-amount').value + '\n' +
                     'Room Booking Amount: ' + document.getElementById('room-booking-amount').value + '\n' +
                     'Donation Amount: ' + document.getElementById('donation-amount').value + '\n' +
                     'Total Amount: ' + document.getElementById('total-amount').value + '\n' ,
        handler: function(response) {
            if (response.razorpay_payment_id) {
                // On success, display success screen with transaction ID
                document.body.innerHTML = '<h1 class=\'success-message\'>Payment Successful!</h1>' +
                                          '<p>Transaction ID: ' + response.razorpay_payment_id + '</p>' +
                                          '<p>Form Data:</p>' +
                                          '<ul>' +
                                          '<li>Name: ' + document.getElementById('name').value + '</li>' +
                                          '<li>Address: ' + document.getElementById('address').value + '</li>' +
                                          '<li>Phone Number: ' + document.getElementById('phone').value + '</li>' +
                                          '<li>Booking Type: ' + document.querySelector('input[name=\'booking\']:checked').value + '</li>';
                if (document.querySelector('input[name=\'booking\']:checked').value === 'with-room') {
                    document.body.innerHTML += '<li>Room Booking Amount: Rs. ' + roomBookingAmount.toFixed(2) + '</li>';
                }
                document.body.innerHTML += '<li>Contribution Amount: Rs. ' + contributionAmount.toFixed(2) + '</li>' +
                                            '</ul>';
            } else {
                // On failure, display failure screen with error message
                document.body.innerHTML = '<h1 class=\'failure-message\'>Payment Failed!</h1>' +
                                          '<p>Error Message: ' + response.error.description + '</p>' +
                                          '<p>Form Data:</p>' +
                                          '<ul>' +
                                          '<li>Name: ' + document.getElementById('name').value + '</li>' +
                                          '<li>Address: ' + document.getElementById('address').value + '</li>' +
                                          '<li>Phone Number: ' + document.getElementById('phone').value + '</li>' +
                                          '<li>Booking Type: ' + document.querySelector('input[name=\'booking\']:checked').value + '</li>';
                if (document.querySelector('input[name=\'booking\']:checked').value === 'with-room') {
                    document.body.innerHTML += '<li>Room Booking Amount: Rs. ' + roomBookingAmount.toFixed(2) + '</li>';
                }
                document.body.innerHTML += '<li>Contribution Amount: Rs. ' + contributionAmount.toFixed(2) + '</li>' +
                                            '</ul>';
            }
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        notes: {
            address: ''
        },
        theme: {
            color: '#F37254'
        }
    };
    var razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
}
