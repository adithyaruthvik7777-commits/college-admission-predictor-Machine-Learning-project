(function () {
  const STORAGE_KEY = "admission-predictor-values";
  const FIELD_ORDER = ["gre", "toefl", "rating", "sop", "lor", "cgpa", "research"];
  const INTERCEPT = -1.2757250829969846;
  const COEFFICIENTS = {
    gre: 0.0018585064850102067,
    toefl: 0.0027779723914195496,
    rating: 0.005941368040176783,
    sop: 0.00158613745576668,
    lor: 0.01685874235241867,
    cgpa: 0.11838505345773812,
    research: 0.024307478582166062,
  };

  function normalizeValues(values) {
    if (!values) {
      return null;
    }

    const normalized = {};

    for (const field of FIELD_ORDER) {
      const rawValue = values[field];

      if (rawValue === undefined || rawValue === null || rawValue === "") {
        return null;
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return null;
      }

      normalized[field] = numericValue;
    }

    return normalized;
  }

  function readInputFromForm(form) {
    const formData = new FormData(form);
    const values = {};

    for (const field of FIELD_ORDER) {
      values[field] = formData.get(field);
    }

    return normalizeValues(values);
  }

  function readInputFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const values = {};

    for (const field of FIELD_ORDER) {
      values[field] = params.get(field);
    }

    return normalizeValues(values);
  }

  function readInputFromSession() {
    try {
      const rawValue = window.sessionStorage.getItem(STORAGE_KEY);

      if (!rawValue) {
        return null;
      }

      return normalizeValues(JSON.parse(rawValue));
    } catch (error) {
      return null;
    }
  }

  function storeInput(values) {
    const normalized = normalizeValues(values);

    if (!normalized) {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  function toQueryString(values) {
    const normalized = normalizeValues(values);
    const params = new URLSearchParams();

    if (!normalized) {
      return "";
    }

    for (const field of FIELD_ORDER) {
      params.set(field, normalized[field]);
    }

    return params.toString();
  }

  function predict(values) {
    const normalized = normalizeValues(values);

    if (!normalized) {
      return null;
    }

    let chance = INTERCEPT;

    for (const field of FIELD_ORDER) {
      chance += normalized[field] * COEFFICIENTS[field];
    }

    const percentage = Math.max(1, Math.min(99, chance * 100));
    return Math.round(percentage * 100) / 100;
  }

  function isStaticPage() {
    return /\.html?$/i.test(window.location.pathname);
  }

  function getResultUrl() {
    return isStaticPage() ? "result.html" : "/result";
  }

  function getIndexUrl() {
    return isStaticPage() ? "index.html" : "/";
  }

  window.admissionPredictor = Object.freeze({
    getIndexUrl,
    getResultUrl,
    predict,
    readInputFromForm,
    readInputFromQuery,
    readInputFromSession,
    storeInput,
    toQueryString,
  });
})();
