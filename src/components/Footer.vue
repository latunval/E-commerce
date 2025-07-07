<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4>Elysian Fashion Hub</h4>
        <p>Your premier destination for stylish and affordable fashion.</p>
        <div class="social-links">
          <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-pinterest"></i></a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Quick Links</h4>
        <!-- <ul class="footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/shop">Shop</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/blog">Blog</router-link></li>
        </ul> -->
      </div>

      <div class="footer-section">
        <h4>Customer Service</h4>
        <!-- <ul class="footer-links">
          <li><router-link to="/faq">FAQ</router-link></li>
          <li><router-link to="/shipping">Shipping Policy</router-link></li>
          <li><router-link to="/returns">Return Policy</router-link></li>
          <li><router-link to="/privacy">Privacy Policy</router-link></li>
          <li><router-link to="/terms">Terms of Service</router-link></li>
        </ul> -->
      </div>

      <div class="footer-section">
        <h4>Contact Us</h4>
        <ul class="contact-info">
          <li><i class="fas fa-map-marker-alt"></i> 123 Fashion St, Lagos, Nigeria</li>
          <li><i class="fas fa-phone"></i> +234 812 345 6789</li>
          <li><i class="fas fa-envelope"></i> info@elysianfashion.com</li>
          <li><i class="fas fa-clock"></i> Mon-Fri: 9AM - 6PM</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="payment-methods">
        <i class="fab fa-cc-visa"></i>
        <i class="fab fa-cc-mastercard"></i>
        <i class="fab fa-cc-paypal"></i>
        <i class="fab fa-bitcoin"></i>
      </div>
      <p>&copy; {{ currentYear }} Elysian Fashion Hub. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 40px 0 0;
  /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-section {
  margin-bottom: 30px;
}

.footer-section h4 {
  color: #f1c40f;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background-color: #f1c40f;
}

.footer-section p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #34495e;
  color: #ecf0f1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: #f1c40f;
  color: #2c3e50;
  transform: translateY(-3px);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #f1c40f;
  padding-left: 5px;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.contact-info i {
  color: #f1c40f;
  margin-top: 3px;
}

.footer-bottom {
  background-color: #1a252f;
  padding: 20px 0;
  text-align: center;
}

.footer-bottom p {
  margin: 10px 0 0;
  color: #bdc3c7;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #bdc3c7;
}

.payment-methods i {
  transition: color 0.3s ease;
}

.payment-methods i:hover {
  color: #f1c40f;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer-container {
    grid-template-columns: 1fr;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>