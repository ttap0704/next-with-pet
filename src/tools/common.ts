export function toggleButton(ids: string[], type: string) {
  for (let i = 0, leng = ids.length; i < leng; i++) {
    const id = ids[i];
    const target: HTMLElement = document.getElementById(id);

    if (type == "enter") {
      target.style.display = "block";
    } else {
      target.style.display = "none";
    }
  }
}