// Calculate aggregate based on university formula
export function calculateAggregate(matric, fsc, test, formula) {
  const m = parseFloat(matric) || 0;
  const f = parseFloat(fsc) || 0;
  const t = parseFloat(test) || 0;

  const result =
    m * (formula.matric || 0) +
    f * (formula.fsc || 0) +
    t * (formula.test || 0);

  return Math.round(result * 100) / 100;
}

// Tell student if they are likely, borderline, or below merit
export function getMeritStatus(aggregate, lastMerit) {
  if (!lastMerit || lastMerit.length === 0) {
    return { status: "unknown", label: "No Data Yet", color: "gray" };
  }

  const closing = lastMerit[0].closing;
  const diff = aggregate - closing;

  if (diff >= 3)
    return { status: "likely", label: "Likely Admitted", color: "green", diff };
  if (diff >= 0)
    return { status: "borderline", label: "Borderline", color: "orange", diff };
  return { status: "unlikely", label: "Below Merit", color: "red", diff };
}

// Format PKR amount nicely
export function formatFee(amount) {
  if (!amount) return "N/A";
  return "PKR " + amount.toLocaleString();
}

// How many days until deadline
export function daysUntilDeadline(dateStr) {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  if (isNaN(deadline.getTime())) return null;
  const now = new Date();
  const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diff;
}

// Return label and color for deadline countdown
export function deadlineLabel(days) {
  if (days === null || isNaN(days)) return { text: "Not Announced", color: "gray" };
  if (days < 0) return { text: "Deadline Passed", color: "red" };
  if (days === 0) return { text: "Last Day Today!", color: "red" };
  if (days <= 7) return { text: days + " days left", color: "orange" };
  if (days <= 30) return { text: days + " days left", color: "yellow" };
  return { text: days + " days left", color: "green" };
}
