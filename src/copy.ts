/** Copies text to the clipboard in browser environments. */
export async function copyText(text: string) {
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(text);
		return true;
	}

	const textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	let successful = false;
	try {
		successful = document.execCommand("copy");
	} catch (err) {}

	document.body.removeChild(textArea);

	return successful;
}
