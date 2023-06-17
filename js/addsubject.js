function createArrayFromHTML(selector) {
    const elementList = document.querySelectorAll(selector);
    const array = Array.from(elementList).map(element => element.textContent);
    return array;
}
  
const arr = createArrayFromHTML('#page-body > div.radius-01 > table:nth-child(10) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > form > table.border_1 td');
  
const pf = arr[0]
const trimmedArr = pf.trim();

const years = []

const student = {
    "mssv": trimmedArr.split(':')[1].split('-')[0].trim(),
    "hoten": trimmedArr.split(':')[2].split('-')[0].trim(),
    "lop": trimmedArr.split(':')[3].trim(),
    "subjects": []
};
  
for (let i = 7; i < arr.length; i += 6) {

    years.push((arr[i+4] && arr[i+4].substring(0,4)) ? parseInt(arr[i+4].substring(0,4)) + 1 : null)

    const subject = {
        "stt": arr[i],
        "ma_hoc_phan": arr[i+1],
        "ten_hoc_phan": arr[i+2],
        "so_tc": parseInt(arr[i+3]),
        "nam_hoc": (arr[i+4] && arr[i+4].substring(0,4)) ? parseInt(arr[i+4].substring(0,4)) + 1 : null,
        "hoc_ki": (arr[i+5] === "hè") ? 3 : parseInt(arr[i+5]),
    }
    student.subjects.push(subject);
}


localStorage.setItem("years", Array.from(new Set(years)).filter(year => year !== null));
localStorage.setItem("studentData", JSON.stringify(student));


