import account from '../assets/images/account.webp';
import address from '../assets/images/addresses.webp';
import order from '../assets/images/orders.webp';
import payment from '../assets/images/payments.webp';
import security from '../assets/images/security.webp';
import shipping from '../assets/images/shipping.webp';

export const supportCategories = [
    {
        id: "orders",
        title: "Orders",
        subtitle: "Manage your purchases",
        desc: "Place new orders, review your purchases, and cancel items before processing. Get help with any issue related to your order activity.",
        icon: order,
        link: "ORDER FAQS",
        faqs: [
            { q: "How do I place an order?", a: "Browse products, add to cart, and complete checkout" },
            { q: "What happens after I place an order?", a: "Once you place an order, you will receive a confirmation email with all details." },
            { q: "How can I cancel my order?", a: "You can cancel your order before it is shipped from the 'My Orders' section." },
            { q: "Can I delay my order?", a: "Order processing starts immediately; however, you can contact support for specific requests." },
            { q: "Can I change my order after placing it?", a: "Changes to order items are possible only before the order moves to 'Processed' status." },
            { q: "How do I check my order status?", a: "Visit 'My Orders' in your account profile to track the real-time status of your purchase." },
            { q: "How do I view my orders?", a: "All your past and current orders are listed in the 'Orders' tab of your account." },
            { q: "Can I cancel part of my order?", a: "Yes, specific items can be cancelled before the shipment process begins." },
            { q: "How long does order processing take?", a: "Most orders are processed within 24-48 business hours." },
            { q: "What if I entered wrong details in my order?", a: "Please contact our support team immediately to update shipping or contact details." },
            { q: "Will I get confirmation after placing an order?", a: "Yes, an automated confirmation email is sent to your registered email address." },
            { q: "Why is my order not processed yet?", a: "Processing might be delayed due to high demand, stock availability or verification checks." },
            { q: "Why was my order cancelled?", a: "Orders may be cancelled due to stock unavailability, payment failure, or security reasons." },
            { q: "Can I place an order using saved details?", a: "Absolutely! Logged-in users can use saved addresses and payment methods for faster checkout." },
            { q: "Can I place an order without an account?", a: "Yes, we offer guest checkout, but creating an account helps you track orders easily." }
        ]
    },
    {
        id: "payments",
        title: "Payments",
        subtitle: "Cards and transactions",
        desc: "Add or remove payment methods, manage your saved cards securely, and resolve issues like failed or declined payments quickly.",
        icon: payment,
        link: "PAYMENT FAQS",
        faqs: [
            { q: "Why did my payment fail?", a: "Common reasons include incorrect card details, insufficient funds, or bank-side security blocks." },
            { q: "How do I add a payment method?", a: "Navigate to the 'Payments' section in your account settings and click 'Add New Card'." },
            { q: "How do I remove a saved card?", a: "In the 'Payments' section, click the 'Delete' icon next to the card you wish to remove." },
            { q: "Is it safe to save my card details?", a: "Yes, we use industry-standard encryption and secure gateways to protect your information." },
            { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking and popular digital wallets." },
            { q: "Can I use multiple cards for one order?", a: "Currently, we only support one payment method per transaction." },
            { q: "How do I get a payment invoice?", a: "Invoices are sent to your email and can also be downloaded from the 'Orders' section." },
            { q: "What is the process for a refund?", a: "Refunds are processed to the original payment method within 5-7 business days after approval." },
            { q: "My account was debited but order is not placed?", a: "This usually happens due to a technical glitch. The amount is typically refunded automatically within 24 hours." },
            { q: "Do you accept international cards?", a: "Yes, we accept major international credit cards processed through our secure gateway." },
            { q: "How do I apply a coupon code?", a: "You can enter your coupon code at the checkout page before proceeding to payment." },
            { q: "Is cash on delivery available?", a: "Cash on delivery availability depends on your location and order value, shown at checkout." }
        ]
    },
    {
        id: "account",
        title: "Account",
        subtitle: "Profile and settings",
        desc: "Update your personal details, manage account preferences, and keep your profile information accurate for a better experience.",
        icon: account,
        link: "ACCOUNT FAQS",
        faqs: [
            { q: "How do I update my profile details?", a: "Go to your 'Profile' section and click 'Edit' to change your name, phone, or email." },
            { q: "How do I change my password?", a: "Use the 'Change Password' option in the 'Security' tab of your account settings." },
            { q: "How do I delete my account?", a: "Please contact our support team for account deactivation or deletion requests." },
            { q: "Can I have multiple accounts?", a: "We recommend using one account per user to keep your order history consolidated." },
            { q: "How do I manage email notifications?", a: "You can toggle various notification types in the 'Notification Settings' section of your profile." },
            { q: "I forgot my password, how do I reset it?", a: "Click on 'Forgot Password' on the login page to receive a reset link via email." },
            { q: "How do I verify my phone number?", a: "Enter the OTP sent to your mobile number in the 'Profile Verification' section." },
            { q: "Can I see my login history?", a: "Yes, the 'Security' tab shows a list of recent devices and locations used to access your account." },
            { q: "How do I change my primary email?", a: "You can update your email in 'Profile Settings'. It will require verification of the new email." },
            { q: "Is my profile public to others?", a: "No, your profile and personal information are private and only visible to you." },
            { q: "How do I log out from all devices?", a: "Use the 'Logout from All Devices' option in your Security settings to clear all active sessions." },
            { q: "Where can I find my rewards and points?", a: "All your earned rewards and loyalty points are visible in the 'My Rewards' tab." }
        ]
    },
    {
        id: "addresses",
        title: "Addresses",
        subtitle: "Manage locations",
        desc: "Add new delivery addresses, update saved locations, or remove old ones to keep your delivery details accurate and up to date.",
        icon: address,
        link: "ADDRESS FAQS",
        faqs: [
            { q: "How do I add a new address?", a: "Go to 'Addresses' in your account and click 'Add New Address'." },
            { q: "Can I change my delivery address after ordering?", a: "Address changes are only possible if the order hasn't been dispatched yet." },
            { q: "How many addresses can I save?", a: "You can save up to 5 different addresses in your account for convenience." },
            { q: "How do I set a default address?", a: "Click the 'Set as Default' button next to your preferred address in the address book." },
            { q: "Can I save business and home addresses?", a: "Yes, you can label each address as 'Home', 'Work', or 'Other' for easy identification." },
            { q: "Is it possible to deliver to a different city?", a: "Yes, as long as we provided shipping services to that city and the address is valid." },
            { q: "How do I edit an existing address?", a: "Click the 'Edit' icon on any saved address to update its details." },
            { q: "Can I add specific delivery instructions?", a: "Yes, there is a field for 'Delivery Instructions' when adding or editing an address." },
            { q: "Why is my location not serviceable?", a: "Some remote areas may not be covered by our delivery partners at this time." },
            { q: "How do I remove an old address?", a: "Simply click the 'Delete' or 'Bin' icon next to the address you wish to remove." },
            { q: "Can I use a PO Box as an address?", a: "We generally require a physical street address for guaranteed delivery by our couriers." },
            { q: "Is landmark mandatory for address?", a: "While not mandatory, providing a landmark helps our delivery partners find you faster." }
        ]
    },
    {
        id: "security",
        title: "Security",
        subtitle: "Account safety",
        desc: "Get help with OTP login, resolve verification issues, and understand how your account and personal data are kept secure.",
        icon: security,
        link: "SECURITY FAQS",
        faqs: [
            { q: "How does OTP verification work?", a: "An OTP is sent to your registered mobile/email to verify your identity during login or transactions." },
            { q: "What if I don't receive an OTP?", a: "Wait for 2 minutes and click 'Resend'. Ensure you have a stable network connection." },
            { q: "How is my personal data protected?", a: "We follow strict privacy policies and use advanced security measures to safeguard your data." },
            { q: "What is two-factor authentication (2FA)?", a: "2FA adds an extra layer of security by requiring a second form of verification to access your account." },
            { q: "How do I report a suspicious activity?", a: "If you notice anything unusual, please contact our security team immediately at security@support.com." },
            { q: "Are my payments encrypted?", a: "Yes, all payment transactions are encrypted using SSL technology for your safety." },
            { q: "What should I do if my account is hacked?", a: "Immediately reset your password and contact support to lock your account from further access." },
            { q: "How often should I change my password?", a: "We recommend changing your password every 3-6 months for optimal security." },
            { q: "Can I see which devices are logged in?", a: "Yes, the 'Active Sessions' section in your security settings lists all currently logged-in devices." },
            { q: "How do I enable biometric login?", a: "You can enable FaceID or Fingerprint login in the App Settings on supported mobile devices." },
            { q: "Does the app store my CVV?", a: "No, we never store your CVV. It is only used during the live transaction process." },
            { q: "How do I secure my account on public devices?", a: "Always remember to log out after your session and avoid selecting 'Remember Me' on public computers." }
        ]
    },
    {
        id: "shipping",
        title: "Shipping",
        subtitle: "Delivery information",
        desc: "Understand shipping timelines, learn how delivery works, and get clear information about order processing and dispatch updates.",
        icon: shipping,
        link: "SHIPPING FAQS",
        faqs: [
            { q: "How long does delivery take?", a: "Standard delivery usually takes 3-7 business days depending on your location." },
            { q: "Do you offer international shipping?", a: "Currently, we only ship within the country. International shipping is coming soon!" },
            { q: "What are the shipping charges?", a: "Shipping is free for orders above a certain value; otherwise, a flat fee applies based on location." },
            { q: "Can I choose a specific delivery time?", a: "While we can't guarantee a precise time, you can add a preferred time window in delivery notes." },
            { q: "How do I track my shipment?", a: "Once dispatched, a tracking link and ID will be sent to your email and phone." },
            { q: "What if my shipment is delayed?", a: "If your order is delayed beyond the estimated date, please contact us for an updated status." },
            { q: "Who is your courier partner?", a: "We partner with leading logistics companies like BlueDart, FedEx, and Delhivery." },
            { q: "Can I change my shipping method?", a: "Shipping methods can be upgraded to express if requested before the order is dispatched." },
            { q: "Do you deliver on weekends?", a: "Weekend delivery depends on the courier partner's service in your specific pincode." },
            { q: "What if I am not at home during delivery?", a: "The courier will attempt delivery 3 times before returning the package to us." },
            { q: "Is express shipping available?", a: "Yes, express shipping options are shown at checkout for eligible locations." },
            { q: "Does shipping cost depend on weight?", a: "In most cases, we offer flat shipping rates, but very heavy items may incur additional charges." }
        ]
    },
];

export const allFaqs = supportCategories.flatMap(cat => cat.faqs);
