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

export function getDate(req: string) {
  const year = new Date(req).getFullYear();
  const month = new Date(req).getMonth() + 1 < 10 ? `0${new Date(req).getMonth() + 1}` : new Date(req).getMonth() + 1
  const date = new Date(req).getDate() < 10 ? `0${new Date(req).getDate()}` : new Date(req).getDate();
  return `${year}-${month}-${date}`;
}