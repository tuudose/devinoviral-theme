// Popup pentru Link Profil/Postare
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('profile-link-modal');
  const input = document.getElementById('profile-link-input');
  const continueBtn = document.getElementById('continue-checkout');
  const cancelBtn = document.getElementById('cancel-modal');
  const errorMsg = document.getElementById('link-error');
  const buyNowButtons = document.querySelectorAll('[name="checkout"], .shopify-payment-button__button, button[type="submit"]');
  
  let currentForm = null;
  
  // Validare URL
  function isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }
  
  // Activează/dezactivează butonul în funcție de validare
  input.addEventListener('input', function() {
    const value = input.value.trim();
    if (value && isValidUrl(value)) {
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      errorMsg.style.display = 'none';
    } else {
      continueBtn.disabled = true;
      continueBtn.style.opacity = '0.5';
      if (value) {
        errorMsg.style.display = 'block';
      }
    }
  });
  
  // Interceptează click pe "Cumpără acum"
  buyNowButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const form = this.closest('form');
      
      // Verifică dacă este butonul de checkout (nu "Adaugă în coș")
      if (this.name === 'checkout' || this.classList.contains('shopify-payment-button__button')) {
        e.preventDefault();
        e.stopPropagation();
        
        currentForm = form;
        modal.style.display = 'flex';
        input.value = '';
        input.focus();
        continueBtn.disabled = true;
        continueBtn.style.opacity = '0.5';
        errorMsg.style.display = 'none';
      }
    });
  });
  
  // Anulează popup
  cancelBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    currentForm = null;
  });
  
  // Continuă către checkout cu linkul salvat
  continueBtn.addEventListener('click', function() {
    const profileLink = input.value.trim();
    
    if (!isValidUrl(profileLink)) {
      errorMsg.style.display = 'block';
      return;
    }
    
    // Adaugă linkul ca proprietate în formular
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'properties[Link profil/postare]';
    hiddenInput.value = profileLink;
    
    if (currentForm) {
      currentForm.appendChild(hiddenInput);
      currentForm.submit();
    }
    
    modal.style.display = 'none';
  });
  
  // Închide popup la click pe fundal
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      currentForm = null;
    }
  });
});
