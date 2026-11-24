export function fieldErrorMessage(name: string, category = 'required'): string {
  if (name === 'email') return category === 'required' ? 'Enter your email so I can reply.' : 'Enter a valid email address, for example name@company.ie.';
  if (name === 'phone') return 'Check your phone number, or leave it blank and I will reply by email.';
  if (name === 'name') return 'Enter your name (up to 150 characters).';
  if (name === 'service') return 'Choose a service, or select “I am not sure yet”.';
  if (name === 'message') return 'Add a short description of what you need.';
  return 'Please check this field and try again.';
}

export function showFieldError(form: HTMLFormElement, name: string, category: string): void {
  const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${name}"]`);
  if (!field?.insertAdjacentElement) return;
  const id = `${field.id || name}-validation`;
  let error = form.querySelector<HTMLElement>(`[id="${id}"]`);
  if (!error) {
    error = form.ownerDocument.createElement('p'); error.id = id;
    error.className = 'form-field-error'; error.setAttribute('role', 'alert');
    field.insertAdjacentElement('afterend', error);
  }
  error.textContent = fieldErrorMessage(name, category);
  field.setAttribute('aria-invalid', 'true');
  const described = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  described.add(id); field.setAttribute('aria-describedby', [...described].join(' '));
}

export function clearFieldError(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const id = `${field.id || field.name}-validation`;
  field.form?.querySelector(`[id="${id}"]`)?.remove();
  field.removeAttribute('aria-invalid');
  const described = (field.getAttribute('aria-describedby') || '').split(' ').filter(value => value && value !== id);
  if (described.length) field.setAttribute('aria-describedby', described.join(' '));
  else field.removeAttribute('aria-describedby');
}
