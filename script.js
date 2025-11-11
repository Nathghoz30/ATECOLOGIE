const bookingForm = document.querySelector('#bookingForm');
const feedback = document.querySelector('.form-feedback');
const serviceSelect = document.querySelector('#service');
const summaryFields = {
  service: document.querySelector('#summaryService'),
  duration: document.querySelector('#summaryDuration'),
  price: document.querySelector('#summaryPrice'),
};
const scrollTopButton = document.querySelector('.scroll-top');
const currentYearElement = document.querySelector('#currentYear');

const serviceDetails = {
  'site-web': {
    name: 'Création de site web',
    duration: 'Séance de cadrage de 45 minutes',
    price: 'À partir de 950 €',
  },
  depannage: {
    name: 'Dépannage informatique',
    duration: 'Intervention de 60 minutes',
    price: 'À partir de 90 €',
  },
  graphisme: {
    name: 'Création graphique',
    duration: 'Atelier créatif de 60 minutes',
    price: 'À partir de 350 €',
  },
};

function updateSummary(serviceKey) {
  const details = serviceDetails[serviceKey];

  if (!details) {
    summaryFields.service.textContent = '—';
    summaryFields.duration.textContent = '—';
    summaryFields.price.textContent = '—';
    return;
  }

  summaryFields.service.textContent = details.name;
  summaryFields.duration.textContent = details.duration;
  summaryFields.price.textContent = details.price;
}

function validateForm() {
  const isValid = bookingForm.checkValidity();

  if (!isValid) {
    bookingForm.reportValidity();
    feedback.textContent = 'Veuillez compléter les champs obligatoires.';
    feedback.classList.remove('success');
    feedback.classList.add('error');
  }

  return isValid;
}

function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const formData = new FormData(bookingForm);
  const summary = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: serviceDetails[formData.get('service')]?.name ?? '—',
    date: formData.get('date'),
    time: formData.get('time'),
  };

  feedback.textContent = `Merci ${summary.name}! Nous vous recontactons à ${summary.email} pour confirmer votre rendez-vous.`;
  feedback.classList.remove('error');
  feedback.classList.add('success');

  bookingForm.reset();
  updateSummary('');
}

function toggleScrollButton() {
  if (window.scrollY > 400) {
    scrollTopButton.classList.add('visible');
  } else {
    scrollTopButton.classList.remove('visible');
  }
}

serviceSelect?.addEventListener('change', (event) => {
  updateSummary(event.target.value);
});

bookingForm?.addEventListener('submit', handleSubmit);

scrollTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', toggleScrollButton);

toggleScrollButton();
updateSummary(serviceSelect?.value ?? '');

if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}
