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

async function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const endpoint = window.APPOINTMENT_FORM_ENDPOINT?.trim();
  if (!endpoint || endpoint.includes('PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE')) {
    feedback.textContent =
      "Le service de prise de rendez-vous n'est pas disponible. Merci de nous contacter directement par email ou téléphone.";
    feedback.classList.remove('success');
    feedback.classList.add('error');
    console.error('APPOINTMENT_FORM_ENDPOINT is missing or not configured.');
    return;
  }

  const formData = new FormData(bookingForm);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    serviceLabel: serviceDetails[formData.get('service')]?.name ?? '—',
    date: formData.get('date'),
    time: formData.get('time'),
    message: formData.get('message'),
    consent: formData.get('consent') === 'on',
    submittedAt: new Date().toISOString(),
  };

  feedback.textContent = 'Envoi de votre demande en cours…';
  feedback.classList.remove('success', 'error');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Réponse du serveur invalide (${response.status})`);
    }

    const result = await response.json().catch(() => ({}));
    const confirmationMessage =
      result.message ||
      `Merci ${payload.name} ! Nous avons bien reçu votre demande et vous enverrons une confirmation à ${payload.email}.`;

    feedback.textContent = confirmationMessage;
    feedback.classList.remove('error');
    feedback.classList.add('success');

    bookingForm.reset();
    updateSummary('');
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
    feedback.textContent =
      "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter directement.";
    feedback.classList.remove('success');
    feedback.classList.add('error');
  }
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
