        gsap.from('.navbar', {
            y: -100,
            duration: 1,
            opacity: 0
        });

        gsap.from('.hero-section h1', {
            y: 100,
            duration: 1,
            opacity: 0,
            delay: 0.5
        });

        gsap.from('.hero-section p', {
            y: 50,
            duration: 1,
            opacity: 0,
            delay: 1
        });
        gsap.from('.menu-item', {
            scrollTrigger: {
                trigger: '#menu',
                start: 'top center'
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        });
        // Cart functionality
        let cart = [];
        let cartCount = 0;
        
        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.btn-primary').forEach(button => {
            if(button.textContent === 'Add to Cart') {
                button.addEventListener('click', function() {
                    const menuItem = this.closest('.card');
                    const itemName = menuItem.querySelector('.card-title').textContent;
                    const itemPrice = parseFloat(menuItem.querySelector('strong').textContent.replace('₹', ''));
                    
                    // Add item to cart
                    cart.push({
                        name: itemName,
                        price: itemPrice
                    });
                    
                    updateCart();
                });
            }
        });

        function updateCart() {
            const cartItems = document.getElementById('cartItems');
            const emptyCartMessage = document.getElementById('emptyCartMessage');
            const cartTotal = document.getElementById('cartTotal');
            const totalAmount = document.getElementById('totalAmount');
            const checkoutBtn = document.getElementById('checkoutBtn');
            const cartCountBadge = document.querySelector('.cart-count');
            
            // Update cart count badge
            cartCountBadge.textContent = cart.length;
            
            if(cart.length === 0) {
                emptyCartMessage.classList.remove('d-none');
                cartTotal.classList.add('d-none');
                checkoutBtn.disabled = true;
                return;
            }

            // Clear and update cart items
            emptyCartMessage.classList.add('d-none');
            cartTotal.classList.remove('d-none');
            checkoutBtn.disabled = false;
            
            // Clear existing items
            while(cartItems.firstChild && cartItems.firstChild !== emptyCartMessage) {
                cartItems.removeChild(cartItems.firstChild);
            }
            
            // Add new items and calculate total
            let total = 0;
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'd-flex justify-content-between align-items-center mb-2';
                itemElement.innerHTML = `
                    <span>${item.name}</span>
                    <div>
                        <span class="me-3">₹${item.price.toFixed(2)}</span>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">×</button>
                    </div>
                `;
                cartItems.insertBefore(itemElement, emptyCartMessage);
                total += item.price;
            });
            
            totalAmount.textContent = total.toFixed(2);
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }
        // Checkout button handler with image display
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            // Create and show success image
            const successImage = document.createElement('img');
            successImage.src = "nandani.png"; // Update with actual image path
            successImage.style.width = '100%';
            successImage.style.maxWidth = '300px';
            successImage.style.height = 'auto';
            successImage.style.display = 'block';
            successImage.style.margin = '20px auto';
            
            // Clear cart items and add image
            cartItems.innerHTML = '';
            cartItems.appendChild(successImage);
            
            // Reset cart
            cart = [];
            updateCart();
            
            // Remove image after 3 seconds
            setTimeout(() => {
                successImage.remove();
            }, 3000);
        });



        // Hide checkout button and show COD form when checkout clicked
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            document.getElementById('checkoutBtn').style.display = 'none';
            document.getElementById('codForm').style.display = 'block';
            document.getElementById('codForm').style.textAlign = 'center';
        });

        // Handle COD form submission
        document.getElementById('deliveryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const address = document.getElementById('deliveryAddress').value;
            const contact = document.getElementById('contactNumber').value;

            if (!address || !contact) {
                alert('Please fill in all delivery details');
                return;
            }

            // Create and show success image
            const successImage = document.createElement('img');
            successImage.src = "nandani.png";
            successImage.style.width = '20vw'; 
            successImage.style.display = 'block';
            successImage.style.margin = '20px auto';
            
            // Clear cart items and add success image
            cartItems.innerHTML = '';
            cartItems.appendChild(successImage);
            
            // Reset cart and form
            cart = [];
            document.getElementById('deliveryForm').reset();
            document.getElementById('codForm').style.display = 'none';
            document.getElementById('checkoutBtn').style.display = 'block';
            
            updateCart();
            
            // Remove success image after 3 seconds
            setTimeout(() => {
                successImage.remove();
            }, 3000);
        });

        // Initially hide COD form and center align
        document.getElementById('codForm').style.display = 'none';
        document.getElementById('codForm').style.textAlign = 'center';
        // Show card payment form when checkout button is clicked
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            document.getElementById('checkoutBtn').style.display = 'none';
            document.getElementById('codForm').style.display = 'block';
            document.getElementById('cardForm').style.display = 'block';
            document.getElementById('codForm').style.textAlign = 'center';
            document.getElementById('cardForm').style.textAlign = 'center';
        });

        // Function to open the toppings modal
        function openToppingsModal() {
            var toppingsModal = new bootstrap.Modal(document.getElementById('toppingsModal'));
            toppingsModal.show();
        }

        // Add event listener to the "Add to Cart" button in the toppings modal
        document.getElementById('addToppingsBtn').addEventListener('click', function() {
            const selectedToppings = Array.from(document.getElementById('toppingsSelect').selectedOptions).map(option => option.value);
            const selectedSauces = Array.from(document.getElementById('saucesSelect').selectedOptions).map(option => option.value);
            const selectedDrink = document.getElementById('drinksSelect').value;

            // Add selected items to the cart
            selectedToppings.forEach(topping => addToCart(topping));
            selectedSauces.forEach(sauce => addToCart(sauce));
            addToCart(selectedDrink);

            // Close the modal
            var toppingsModal = bootstrap.Modal.getInstance(document.getElementById('toppingsModal'));
            toppingsModal.hide();
        });

        // Function to add items to the cart
        function addToCart(item) {
            const cartItems = document.getElementById('cartItems');
            const emptyCartMessage = document.getElementById('emptyCartMessage');
            const cartTotal = document.getElementById('cartTotal');

            // Hide empty cart message
            emptyCartMessage.style.display = 'none';

            // Create cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.textContent = item;

            // Append cart item to cart items container
            cartItems.appendChild(cartItem);

            // Update cart total
            updateCartTotal();
        }
        // Function to update cart total
        function updateCartTotal() {
            const cartItems = document.getElementById('cartItems').children;
            const totalAmount = document.getElementById('totalAmount');
            let total = 0;

            // Calculate total amount
            for (let item of cartItems) {
                total += 50; // Assuming each item costs 50 for simplicity
            }

            // Update total amount display
            totalAmount.textContent = total.toFixed(2);

            // Show cart total section if there are items in the cart
            const cartTotal = document.getElementById('cartTotal');
            if (cartItems.length > 0) {
                cartTotal.classList.remove('d-none');
            } else {
                cartTotal.classList.add('d-none');
            }
        }

