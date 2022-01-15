export function toggleButton(ids: string[], type: string, length?: number) {
  if (length && length == 0) return;
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

export function readFile(file: File):Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.toString())
    reader.readAsDataURL(file)
  })
}

export function setSlideNumber(num: number, type:string, length:number):Promise<number> {
  return new Promise((resolve) => {
    const max = length - 1;

    if (type == "next") {
      num++;
    } else {
      num--;
    }
  
    if (num > max) {
      num = 0;
    } else if (num < 0) {
      num = max;
    }
  
    resolve(num)
  })
}