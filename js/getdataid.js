
const mssv = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > div").innerHTML;
const hoten = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > div").innerHTML;
const ngaysinh = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > div").innerHTML;
const gioitinh = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(6) > td:nth-child(2) > div").innerHTML;
const lop = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(7) > td:nth-child(2) > div").innerHTML;
const nganh = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(8) > td:nth-child(2) > div").innerHTML;
const khoa_hoc = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(9) > td:nth-child(2) > div").innerHTML;
const truong = document.querySelector("#page-body > div.radius-01.grid_96.div-center > table > tbody > tr:nth-child(1) > td.grid_48 > div > table > tbody > tr:nth-child(10) > td:nth-child(2) > div").innerHTML;



localStorage.setItem("_0x31_", encodeStringToBase64(mssv.trim()));
localStorage.setItem("_0x32_", encodeStringToBase64(hoten.trim()+"/nttt/"+ngaysinh.trim()+"/nttt/"+gioitinh.trim()+"/nttt/"+lop.trim()+"/nttt/"+nganh.trim()+"/nttt/"+khoa_hoc.trim()+"/nttt/"+truong.trim()));

function encodeStringToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
