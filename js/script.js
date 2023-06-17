const lnk2 = document.querySelector("#lnk2");

if (lnk2) {
  const btn_home = document.querySelector('#tbl0 > tbody > tr');
  const home = `<td id="sep4" style="padding:0px;width:1px;;background:#2D729D"><table class="milonictable" border="0" cellpadding="0" cellspacing="0" style="padding:0px" width="1"><tbody><tr><td style="padding:0px;"></td></tr></tbody></table></td>
                <td nowrap="" tabindex="6" id="el6" style="padding: 5px; height: 100%;">
                <a class="btn-tkb" name="mM1">Tạo thời khóa biểu</a>
            </td>`;
  btn_home.insertAdjacentHTML('beforeend', home);
}

// Class to store variables
class VariableStorage {
    constructor() {
      this.full_option = false;
    }
}
var variable = new VariableStorage();

class API {
    callAPI(val, mssv) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const url = `https://mtphone.000webhostapp.com/ctu/htql.php?key=${val}&key1=${mssv}`;

			xhr.open('GET', url, true);
			xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
				const decodedData = atob(xhr.responseText);
				if (decodedData === 'true') {
					resolve(true);
				} else if (decodedData === 'false') {
					resolve(false);
				} else {
					reject(new Error('Kết quả không hợp lệ'));
				}
				} else {
				reject(new Error('Lỗi kết nối API'));
				}
			}
			};
			xhr.send();
		});
		}

		async handleAPI(val, mssv) {
            try {
                const result = await this.callAPI(val, mssv);
                // Xử lý kết quả trả về true hoặc false
                return result;
            } catch (error) {
            return false;
		}
	}
}

const api = new API();


class Message {
    constructor(){

    }

    encodeStringToBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
      
    
    decodeBase64ToString(encodedStr) {
        return decodeURIComponent(escape(atob(encodedStr)));
    }

    encodeStringToNumbers(str) {
        var encodedStr = "";
        for (var i = 0; i < str.length; i++) {
            encodedStr += str.charCodeAt(i).toString();
        }
        return encodedStr;
    }

    createCenteredInput() {
        var container = document.createElement("div");
        container.className = "centered-container";

        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Nhập key ...";
        input.name = "key";
        input.required = true;
        input.className = "centered-input";

        var checkButton = document.createElement("button");
        checkButton.textContent = "Kiểm tra";
        checkButton.type = "button";
        checkButton.className = "custom-button check-button";

        checkButton.addEventListener("click", function() {

            var encoded_mssv = mes_.encodeStringToNumbers(mes_.decodeBase64ToString(localStorage.getItem("_0x31_"))).substring(6)
            var key = input.value;

            if (key === encoded_mssv) {
                localStorage.setItem('_0x31_0x', encoded_mssv);
                alert("Key hợp lệ!");
                document.body.removeChild(container);
                variable.full_option = true;
            } else {
                alert("Key không hợp lệ!");
            }
        });

        var createButton = document.createElement("button");
        createButton.textContent = "Tạo khóa";
        createButton.type = "submit";
        createButton.className = "custom-button create-button";

        createButton.addEventListener("click", function() {
            window.location.href = "https://tritran280.github.io/tkb-create-key/";
        });

        var closeSpan = document.createElement("span");
        closeSpan.textContent = "x";
        closeSpan.className = "close-button";

        closeSpan.addEventListener("click", function() {
            document.body.removeChild(container);
        });

        container.appendChild(input);
        container.appendChild(checkButton);
        container.appendChild(closeSpan);
        container.appendChild(createButton);

        document.body.appendChild(container);
    }
}

const mes_ = new Message()


/* Lấy data tất cả môn học và cho vào bảng*/

/* Tạo tất cả trường hợp khi click vào vào nhóm*/

class Data {
    constructor(){
        this.allSubjects = {};
        this.years = [];
        this.numSelectedCourse = 0;

        this.allSubjectsData = []
        this.courseNotOpen = []
        this.selectedCourse = [];

        this.dataSaukhiloc = []
        this.tongTKbtaora = 0
        this.tkbHientai_num = 0
        this.dataTkbhientai = []
    }
}

class Display {
    constructor(){
        this.myDiv = document.querySelector('#page-body > div.box-shadow');
        this.tableBody = document.querySelector('#page-body > div.radius-01 > table > tbody')
        this.hocKy;
        this.hocKy;
        this.btn_createKtb;
    }

    formUi(){
        const tableHTML = `
            <div class="page-home radius-01">
                
                <div class="top-h-ct-left radius-01">
                    <td colspan="4" align="center" class="main_1">Học kỳ:&nbsp;
                        <select name="cmbHocKy" id="cmbHocKyk" class="cmb">
                            <option selected="" value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">Hè</option>
                        </select>
                        &nbsp; &nbsp; Năm học:&nbsp;
                        <select name="cmbNamHoc" id="cmbNamHock" class="cmb"></select>
                        &nbsp; &nbsp;
                        <div class="status">&nbsp</div>
                    </td>
                </div>

                <div class="table-data-cr radius-01"></div>
                
                <div class="tkb_table_ radius-01">
                    <div class="_table_ radius-01">
                        <table class="table-tkb">
                            <thead class="thead-tkb"></thead>
                            <tbody class="tbody-tkb"></tbody>
                        </table>
                    </div>
                    <div class="live-show radius-01 pagination">
                        <a id="schedule-count">0/0</a>
                        <a class="prev-btn">&laquo; Prev</a>
                        <a class="next-btn">Next &raquo;</a>
                        <a class="status-bieudo">Hiện Biểu đồ</a>
                    </div>
                    <div class="radius-01 bieudo">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            </div>`;
        
        this.myDiv.insertAdjacentHTML('afterend', tableHTML);
    }

    addTableHeaderDaysOfWeek() {
        var thead = document.querySelector('.thead-tkb');
        var daysOfWeek = ['Tiết', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
        var tr = document.createElement('tr');
        for (var i = 0; i < daysOfWeek.length; i++) {
            var th = document.createElement('th');
            th.textContent = daysOfWeek[i];
            th.classList.add('set-bg-0');
            th.setAttribute('id', (i+1));
            th.addEventListener('click', function() {
                var id = this.id;
                var className = this.className;
                if (parseInt(id)>1){
    
                    //
                }
            });
            tr.appendChild(th);
        }
        thead.appendChild(tr);
    }

    addScheduleTable() {
        for (var i = 1; i <= 10; i++) {
            var row = document.createElement('tr');
            var tieth = document.createElement('td');
            tieth.textContent = 'Tiết ' + i;
            row.appendChild(tieth);
    
            for (var j = 2; j <= 8; j++) {
                var cell = document.createElement('td');
                var cellId = 't' + j + 't' + i;
                cell.setAttribute('id', cellId);
                (function(id) {
                    cell.addEventListener('click', function() {
                        //
                    });
                })(cellId);
                row.appendChild(cell);
            }
    
            document.querySelector('.tbody-tkb').appendChild(row);
        }
    }

    addYearSelect(years, selectedYear) {
        const select = document.getElementById('cmbNamHock');
        years.forEach(year => {
            const option = document.createElement('option');
            option.setAttribute('value', year);
            option.textContent = `${year - 1} - ${year}`;
            if (year == selectedYear) {
                option.setAttribute('selected', 'selected');
            }
            select.appendChild(option);
        });
    }

    createTableData(){
        var htmlToAdd = `
          <nav class="nav-title">
            <label for="courseFilter">Chọn mã học phần:</label>
            <select id="courseFilter"></select>
            <input type="checkbox" name="" id="click-all-groups">
            <div id="selectedCourseName"></div>

            </nav>
            <div class="slidecontainer">
                <p>Sỉ số còn ít nhất:</p>
                <input type="range" id="myRange-siso" min="0" max="10" value="0">
                <div class="slider-value">
                    <span id="value-siso">0</span>
                </div>
            </div>
        
          <table id="myTable">
            <thead>
              <tr>
                <th>Mã HP</th>
                <th>Chọn</th>
                <th>Kí hiệu</th>
                <th>Thứ</th>
                <th>Tiết BĐ</th>
                <th>Số tiết</th>
                <th>Phòng</th>
                <th>Sỉ số</th>
                <th>Còn lại</th>
                <th>Tuần học</th>
                <th>Lớp HP</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        `;
        var tableDataCr = document.querySelector('.table-data-cr');
        tableDataCr.innerHTML = htmlToAdd;
    }

    showTkb(data) {
        if (data === undefined){
            return;
        }
        data_.dataTkbhientai = data;
        const list = datapr_.cr_Id(data);
        
        const labels = data.map(item => `${item.mhp} - ${item.data[0].ki_hieu}`);
        const remaining = data.map(item => item.data[0].si_so_con_lai);
        const total = data.map(item => item.data[0].si_so);
        
        chartGenerator.updateChart(labels, remaining, total);

        document.getElementById('schedule-count').innerHTML = data_.tkbHientai_num + 1 + '/' + data_.all_combinations.length;
        
        const contentMap = {}; // Đối tượng để lưu trữ màu của từng nội dung
        const colorArray = [ '#c0ffc0', '#b1e0ff', '#c0c0ff', '#ffffc0','#e0b1ff', '#ffc0ff', '#c0ffff', '#ffd8b1', '#d8b1ff', '#b1d8ff', '#ffffb1', '#ffb1ff', '#b1ffff', '#ffe0b1'];  // Danh sách 15 màu đã được xác định trước
        
        for (let i = 0; i < list.length; i++) {
            const mon = list[i];
            if (mon.id !== null) {
                const idcell = document.getElementById(mon.id);
                idcell.innerHTML = mon.mhp;
                idcell.style.fontWeight = "bold";
                
                // Kiểm tra nếu nội dung đã tồn tại trong contentMap
                if (contentMap[mon.mhp]) {
                    idcell.style.backgroundColor = contentMap[mon.mhp];
                } else {
                // Lấy màu từ danh sách colorArray theo chỉ số i
                    const colorIndex = i % colorArray.length;
                    const color = colorArray[colorIndex];
                    idcell.style.backgroundColor = color;
                    contentMap[mon.mhp] = color; // Lưu màu vào đối tượng contentMap
                }
            }
        }
    }
      

    deleteTkb(tkb_){
        const list = datapr_.cr_Id(tkb_)
        for(var mon in list){
            if (list[mon].id !== null) {
                const idcell = document.getElementById(list[mon].id);
                idcell.innerHTML = '';
                idcell.style.backgroundColor = 'rgba(215, 250, 249, 0.96)';
            }
        }
    }
      
}

class Crawl {
    async fetchData(namhoc, hocKy) {
        data_.allSubjectsData = [];
        document.querySelector(".status").style.backgroundColor = "red";
        
    
        for (let i = 0; i < data_.numSelectedCourse; i++) {
            const maHp = data_.selectedCourse[i].maHp;
            const tenHP = data_.selectedCourse[i].tenHp;
            try {
                const tdArrayFrom = await this.fetchCourseData(hocKy.value, namhoc.value, maHp);
                if (tdArrayFrom.length > 14){
                    const json = this.convertToJSON(tdArrayFrom, maHp, tenHP);
                    data_.allSubjectsData.push(json);
                }
            } catch (error) {
                console.error(error);
            }
        }
        document.querySelector(".status").style.backgroundColor = "green";
        myDataTable.uploadData(data_.allSubjectsData)
    }

    async fetchCourseData(hocKy, namHoc, maMH) {
        const url = 'https://dkmh.ctu.edu.vn/htql/dkmh/student/index.php?action=dmuc_mhoc_hky';
        const data = new URLSearchParams();
    
        data.append('cmbHocKy', hocKy);
        data.append('cmbNamHoc', namHoc);
        data.append('txtMaMH', maMH);
        data.append('curPage', '+');
        data.append('flag', '1');
        data.append('Button', 'Tìm');
        data.append('txtUserID', '');
      
        const response = await fetch(url, {
            method: 'POST',
            body: data
        })
      
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tdElements = doc.querySelectorAll('td');
        const tdArray = Array.from(tdElements, td => td.innerHTML.trim());
        const tdArrayFrom = tdArray.slice(14);
      
        return tdArrayFrom;
    }

    convertToJSON(tdArrayFrom, maHP, tenHp) {
        const json = {
            "maHP" : maHP,
            "tenHp": tenHp,
            "data": []
        }
      
        for (let i = 11; i < tdArrayFrom.length-10; i += 10) {
            const ki_hieu = tdArrayFrom[i] !== undefined ? tdArrayFrom[i].replace("&nbsp;", "") : "";
            const thu = tdArrayFrom[i + 1] !== undefined ? tdArrayFrom[i + 1].replace("&nbsp;", "") : "";
            const tiet_bd = tdArrayFrom[i + 2] !== undefined ? tdArrayFrom[i + 2].replace("&nbsp;", "") : "";
            const so_tiet = tdArrayFrom[i + 3] !== undefined ? tdArrayFrom[i + 3].replace("&nbsp;", "") : "";
            const phong = tdArrayFrom[i + 4] !== undefined ? tdArrayFrom[i + 4].replace("&nbsp;", "") : "";
            const si_so = tdArrayFrom[i + 5] !== undefined ? tdArrayFrom[i + 5].replace("&nbsp;", "") : "";
            const si_so_con_lai = tdArrayFrom[i + 6] !== undefined ? tdArrayFrom[i + 6].replace("&nbsp;", "") : "";
            const tuan_hoc = tdArrayFrom[i + 7] !== undefined ? tdArrayFrom[i + 7].replace("&nbsp;", "") : "";
            const lop_hp = tdArrayFrom[i + 8] !== undefined ? tdArrayFrom[i + 8].replace("&nbsp;", "") : "";
            
            const obj = {
                "ki_hieu": ki_hieu,
                "thu": thu,
                "tiet_bd": parseInt(tiet_bd),
                "so_tiet": parseInt(so_tiet),
                "phong": phong,
                "si_so": parseInt(si_so),
                "si_so_con_lai": parseInt(si_so_con_lai),
                "tuan_hoc": tuan_hoc,
                "lop_hp": lop_hp,
                "status_nhom": true
            }
            
            json.data.push(obj);
        }
        
        return json;
    }

    
}

class MyDataTable {
    constructor() {
        this.table = null;
        this.data = [];
    }

    initialize() {
        this.table = $('#myTable').DataTable({
            columns: [
                { data: "maHP" },
                { data: null, orderable: false, render: function (data, type, row) {
                    var checked = row.status_nhom ? 'checked' : '';
                    return '<input type="checkbox" ' + checked + '>';
                } },
                { data: "ki_hieu" },
                { data: "thu" },
                { data: "tiet_bd" },
                { data: "so_tiet" },
                { data: "phong", orderable: false },
                { data: "si_so" },
                { data: "si_so_con_lai" },
                { data: "tuan_hoc", orderable: false },
                { data: "lop_hp", orderable: false }
            ]
        });

        // Không tải dữ liệu ban đầu vào bảng ở đây

        $('#click-all-groups').on('change', () => this.toggleAllGroups());

        $('#myTable').on('change', 'input[type="checkbox"]', (event) => {
            const checkbox = event.target;
            this.toggleGroupStatus(checkbox);
        });

        $('#courseFilter').on('change', () => this.filterByCourse());
    }

    loadData(data) {
        this.data = data;

        this.data.forEach((item) => {
            item.data.forEach((row) => {
                if (row.thu.length>2){
                    this.table.row.add({
                        "maHP": item.maHP,
                        "ki_hieu": row.ki_hieu,
                        "thu": "nav",
                        "tiet_bd": "nav",
                        "so_tiet": "nav",
                        "phong": "nav",
                        "si_so": row.tiet_bd,
                        "si_so_con_lai": row.so_tiet,
                        "tuan_hoc": row.phong,
                        "lop_hp": "nav",
                        "status_nhom": row.status_nhom
                    });
                }else {
                    this.table.row.add({
                        "maHP": item.maHP,
                        "ki_hieu": row.ki_hieu,
                        "thu": row.thu,
                        "tiet_bd": row.tiet_bd,
                        "so_tiet": row.so_tiet,
                        "phong": row.phong,
                        "si_so": row.si_so,
                        "si_so_con_lai": row.si_so_con_lai,
                        "tuan_hoc": row.tuan_hoc,
                        "lop_hp": row.lop_hp,
                        "status_nhom": row.status_nhom
                    });

                }
            });

            
            $("#courseFilter").append(`<option value="${item.maHP}">${item.maHP}</option>`);
        });

        // Vẽ lại bảng sau khi tải dữ liệu
        this.table.draw();
    }

    uploadData(newData) {
        this.table.clear();
        this.loadData(newData);
    
        $('#courseFilter').empty();
        $("#courseFilter").append(`<option value="">Tất cả</option>`);
    
        const groupMap = {}; // Đối tượng để lưu trữ nhóm đã ghi
    
        this.data.forEach((item) => {
            let totalGroups = 0; // Biến để tính tổng số nhóm của môn
    
            item.data.forEach((row) => {
                if (groupMap[row.lop_hp]) {
                    // Nếu nhóm đã được ghi, không tăng totalGroups và tiếp tục vòng lặp
                    return;
                }
    
                groupMap[row.lop_hp] = true; // Đánh dấu nhóm đã được ghi
                totalGroups += row.status_nhom ? 1 : 0;
            });
    
            let optionText = `${item.maHP} - ${item.tenHp} (GR: ${totalGroups})`;
            $("#courseFilter").append(`<option value="${item.maHP}">${optionText}</option>`);
        });
    }

    toggleAllGroups() {
        const isChecked = $('#click-all-groups').prop('checked');
        $('#myTable tbody input[type="checkbox"]').prop('checked', isChecked);
    
        const currentPageIndex = this.table.page.info().page;
        const rowsPerPage = this.table.page.info().length;
        const startIndex = currentPageIndex * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
    
        const visibleRows = this.table.rows({ search: 'applied' }).nodes();
        const rowsToToggle = isChecked ? visibleRows : $(visibleRows).slice(startIndex, endIndex);
    
        $(rowsToToggle).each((index, row) => {
            const rowData = this.table.row(row).data();
            rowData.status_nhom = isChecked;

            this.data.forEach((item) => {
                item.data.forEach((row) => {
                    if (row.lop_hp === rowData.lop_hp) {
                    row.status_nhom = isChecked;
                    }
                });
            });
        });

        this.filterDataByStatus();
    }
  
    toggleGroupStatus(checkbox) {
        const tr = $(checkbox).closest('tr');
        const rowData = this.table.row(tr).data();
        const lopHP = rowData.lop_hp;
        const statusNhom = rowData.status_nhom;
    
        rowData.status_nhom = !statusNhom;
    
        const rows = this.table.rows().nodes();
        $(rows).each((index, row) => {
            const rowItem = this.table.row(row).data();
            if (rowItem.lop_hp === lopHP) {
            rowItem.status_nhom = rowData.status_nhom;
            $(row).find('input[type="checkbox"]').prop('checked', rowData.status_nhom);
            }
        });
    
        this.data.forEach((item) => {
            if (item.maHP === rowData.maHP) {
                item.data.forEach((row) => {
                    if (row.lop_hp === lopHP) {
                    row.status_nhom = rowData.status_nhom;
                    }
                });
            }
        });
    
        this.filterDataByStatus();
    }
  
    filterDataByStatus() {
        data_.all_combinations = []
        const filteredData = [];
    
        this.data.forEach((item) => {
            const filteredItem = {
                maHP: item.maHP,
                tenHp: item.tenHp,
                data: []
            };
    
            item.data.forEach((row) => {
                if (row.status_nhom) {
                    filteredItem.data.push(row);
                }
            });
    
            if (filteredItem.data.length > 0) {
                filteredData.push(filteredItem);
            }
        });

        datapr_.generateCombinations(filteredData)
    }
  
    filterByCourse() {
        const selectedCourse = $('#courseFilter').val();
    
        try {
            const selectedCourseName = this.data.find((item) => item.maHP === selectedCourse).tenHp;
            $("#selectedCourseName").text(selectedCourseName);
        } catch {
            $("#selectedCourseName").text('');
        }
    
        if (selectedCourse) {
            this.table.columns(0).search('^' + selectedCourse + '$', true, false);
        } else {
            this.table.columns(0).search('');
        }
    
        this.table.draw();
    }
}

class DataProcessor {
    constructor() {
        this.combMax = 1000;
        this.results = [];
    }

    generateCombinations(subjects) {
        if (subjects.length === 0) {
            return [];
        }

        let combinationCount = 0;
        const all_combinations = [];
        this.results = [];

        const generate = (index, combination) => {
            if (index === subjects.length || combinationCount >= this.combMax) {
                const isDuplicate = this.isDuplicateCombination(all_combinations, combination);

                if (!isDuplicate && this.checkDuplicateSchedule(combination)) {
                    all_combinations.push(combination);
                    combinationCount++;
                    this.results.push(combination);
                }
                return;
            }

            const item = subjects[index];
            const data = item.data;

            for (const itemData of data) {
                const duplicateKiHieus = data.filter((item) => item.ki_hieu === itemData.ki_hieu);
                generate(index + 1, [...combination, { mhp: item.maHP, data: duplicateKiHieus }]);

                if (combinationCount >= this.combMax) {
                    return;
                }
            }
        };

        generate(0, []);
        data_.all_combinations = this.results
        data_.tongTKbtaora = this.results.length
        main_.showAll()
    }

    isDuplicateCombination(all_combinations, combination) {
        for (const existingCombination of all_combinations) {
            if (this.isEqualCombination(existingCombination, combination)) {
                return true;
            }
        }
        return false;
    }

    isEqualCombination(combination1, combination2) {
        if (combination1.length !== combination2.length) {
            return false;
        }

        for (let i = 0; i < combination1.length; i++) {
            const item1 = combination1[i];
            const item2 = combination2[i];

            if (item1.mhp !== item2.mhp || !this.isEqualData(item1.data, item2.data)) {
                return false;
            }
        }

        return true;
    }

    isEqualData(data1, data2) {
        if (data1.length !== data2.length) {
            return false;
        }

        for (let i = 0; i < data1.length; i++) {
            const schedule1 = data1[i];
            const schedule2 = data2[i];

            if (
                schedule1.ki_hieu !== schedule2.ki_hieu ||
                schedule1.thu !== schedule2.thu ||
                schedule1.tiet_bd !== schedule2.tiet_bd ||
                schedule1.so_tiet !== schedule2.so_tiet ||
                schedule1.phong !== schedule2.phong
            ) {
                return false;
            }
        }

        return true;
    }

    checkDuplicateSchedule(tkb) {
        const n = tkb.length;
        const scheduleSet = new Set();

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.hasOverlap(tkb[i], tkb[j])) {
                    scheduleSet.add(i);
                    scheduleSet.add(j);
                }
            }
        }

        return scheduleSet.size === 0;
    }

    hasOverlap(courseA, courseB) {
        let hasOverlap = false;

        for (const scheduleA of courseA.data) {
            for (const scheduleB of courseB.data) {
                if (scheduleA.thu === scheduleB.thu && this.hasTimeOverlap(scheduleA, scheduleB)) {
                    hasOverlap = true;
                    break;
                }
            }

            if (hasOverlap) {
                break;
            }
        }

        return hasOverlap;
    }

    hasTimeOverlap(scheduleA, scheduleB) {
        const endB = scheduleB.tiet_bd + scheduleB.so_tiet;
        const endA = scheduleA.tiet_bd + scheduleA.so_tiet;

        return (
            (scheduleA.tiet_bd >= scheduleB.tiet_bd && scheduleA.tiet_bd < endB) ||
            (scheduleB.tiet_bd >= scheduleA.tiet_bd && scheduleB.tiet_bd < endA)
        );
    }

    filterGroupsByCapacity(groups, n) {
        // Lọc các nhóm học phần theo điều kiện "si_so_con_lai" lớn hơn n
        const filteredGroups = groups.map((course) => {
          const filteredData = course.data.filter((group) => group.si_so_con_lai >= n);
          return { ...course, data: filteredData };
        });
        const filteredCourses = filteredGroups.filter((course) => course.data.length > 0);
      
        return filteredCourses;
    }

    cr_Id(data){
        if (data === undefined){return}
        const result = [];
        
        for (const item of data) {
            for (const dataItem of item.data) {
                const idPrefix = dataItem.thu.length > 2 ? null : `t${dataItem.thu}t`;
                
                if (idPrefix === null) {
                    result.push({ id: null, mhp: `${item.mhp}-${dataItem.ki_hieu}`, data: [dataItem] });
                } else {
                    for (let i = 0; i < dataItem.so_tiet; i++) {
                        const id = `${idPrefix}${dataItem.tiet_bd + i}`;
                        result.push({ id: id, mhp: `${item.mhp}-${dataItem.ki_hieu}`, data: [dataItem] });
                    }
                }
            }
        }
        
        return result;
    }
}

class ChartGenerator {
    constructor(labels, remaining, total) {
        this.labels = labels;
        this.remaining = remaining;
        this.total = total;
        this.chart = null;
        this.numTable = false
    }
  
    createChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.labels,
                    datasets: [
                        {
                            label: 'Còn lại',
                            data: this.remaining,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Tổng số',
                            data: this.total,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20, // Số lượng đơn vị trên trục y
                            callback: (value) => value.toFixed(0) // Định dạng giá trị đơn vị
                        }
                      }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.parsed.y;
                                const rate = (this.remaining[context.dataIndex] / this.total[context.dataIndex] * 100).toFixed(2);
                                return `${datasetLabel}: ${value} || (Tỉ lệ chọn: ${rate}%)`;
                            }
                        }
                    }
                }
            }
      });
    }
  
    updateChart(labels, remaining, total) {
        this.labels = labels;
        this.remaining = remaining;
        this.total = total;
    
        this.chart.data.labels = this.labels;
        this.chart.data.datasets[0].data = this.remaining;
        this.chart.data.datasets[1].data = this.total;
      this.chart.update();
    }
}

class Confix {
    constructor() {
        this.isTableHTMLAdded = false;
        this.isVip = true;
        this.myChart;
        this.isChartVisible = false;
    }
}

class Main {
    constructor() {
        this.btn_createKtb = document.getElementById('el6');
        
        if (this.btn_createKtb){
            this.btn_createKtb.addEventListener('click', this.showGui.bind(this));
        }
    }

    createIdTkb(){
        display_.deleteTkb(data_.dataTkbhientai)
        display_.showTkb(data_.all_combinations[data_.tkbHientai_num])
    }

    setupTableTkb(){
        // sửa số trường hợp tạo ra
        data_.tkbHientai_num = 0
        document.getElementById('schedule-count').innerHTML = (data_.tkbHientai_num + 1) + '/' + data_.tongTKbtaora;

        // tạo các id và show thời khóa biểu
        this.createIdTkb()
    }

    uploadAll(){
        myDataTable.uploadData(data_.dataSaukhiloc)
        datapr_.generateCombinations(data_.dataSaukhiloc)
    }

    createListSbjects() {
        const rowsToAdd = [];
        
        for (let i = 0; i < data_.allSubjects.subjects.length; i++) {
            const subject = data_.allSubjects.subjects[i];
            if (subject.nam_hoc === parseInt(display_.namHoc.value) && subject.hoc_ki === parseInt(display_.hocKy.value)) {
            rowsToAdd.push({ maHp: subject.ma_hoc_phan, tenHp: subject.ten_hoc_phan, clickStatus: true });
            }
        }
        data_.selectedCourse = rowsToAdd;
        data_.numSelectedCourse = rowsToAdd.length;
    }

    async handleChangeWrapper() {
        this.createListSbjects()
        await crawl_.fetchData(display_.namHoc, display_.hocKy);
        datapr_.generateCombinations(data_.allSubjectsData)
        document.getElementById("myRange-siso").value = 0;
        document.getElementById("value-siso").innerHTML = 0;
        $("#selectedCourseName").text('');
    }

    showAll(){
        main_.setupTableTkb()
    }

    async showGui() {

        // kiểm tra key
        // nếu chưa có key thì thì gọi tạo
        const encodedMssv = mes_.encodeStringToNumbers(mes_.decodeBase64ToString(localStorage.getItem("_0x31_"))).substring(6)
        const key = localStorage.getItem("_0x31_0x")
        if (encodedMssv !== key){
            mes_.createCenteredInput()
        } else {
            const result = await api.handleAPI(localStorage.getItem("_0x32_"), localStorage.getItem("_0x31_"));
            if (!confix.isTableHTMLAdded && result){
    
                display_.formUi();
                display_.addYearSelect(data_.years, data_.years[data_.years.length - 1])
                display_.createTableData()
                display_.addTableHeaderDaysOfWeek()
                display_.addScheduleTable()
                chartGenerator.createChart()
    
                myDataTable.initialize()
    
                display_.hocKy =  document.getElementById('cmbHocKyk')
                display_.namHoc = document.getElementById('cmbNamHock')
    
                display_.namHoc.addEventListener('change', this.handleChangeWrapper.bind(this))
                display_.hocKy.addEventListener('change', this.handleChangeWrapper.bind(this))
                this.handleChangeWrapper()
    
                // confix si số còn lại
                var slider_siso = document.getElementById("myRange-siso");
                var value_siso = document.getElementById("value-siso");
                slider_siso.oninput = function() {
                    value_siso.innerHTML = this.value;
                    data_.dataSaukhiloc = datapr_.filterGroupsByCapacity(data_.allSubjectsData, this.value)
                    $("#selectedCourseName").text('');
                    main_.uploadAll()
                };
    
                // btn next tkb
                document.querySelector('.next-btn').addEventListener('click', function(){
                    if (confix.isVip && (data_.tkbHientai_num < data_.all_combinations.length-1)){
                        display_.deleteTkb(data_.dataTkbhientai)
                        data_.tkbHientai_num += 1
                        display_.showTkb(data_.all_combinations[data_.tkbHientai_num])
                    }
                })
    
                document.querySelector('.prev-btn').addEventListener('click', function(){
                    if (confix.isVip && (data_.tkbHientai_num > 0)){
                        display_.deleteTkb(data_.dataTkbhientai)
                        data_.tkbHientai_num -= 1
                        display_.showTkb(data_.all_combinations[data_.tkbHientai_num])
                    }
                })
    
                // hiện biểu đồ
                document.querySelector(".status-bieudo").addEventListener('click', function(){
                    if (confix.isChartVisible){
                        document.querySelector(".status-bieudo").innerHTML = 'Hiện biểu đô';
                        confix.isChartVisible = false
                        document.querySelector('.bieudo').style.display = 'none'
                    }else{
                        document.querySelector(".status-bieudo").innerHTML = 'Ẩn biểu đồ';
                        confix.isChartVisible = true
                        document.querySelector('.bieudo').style.display = 'block'
                    }
                })
    
                if (display_.tableBody) {
                    display_.tableBody.style.display = 'none';
                }
        
                confix.isTableHTMLAdded = true
    
            }
        }
    }
}

const data_ = new Data()
const crawl_ = new Crawl()
const chartGenerator = new ChartGenerator()
const datapr_ = new DataProcessor()

data_.allSubjects = JSON.parse(localStorage.getItem("studentData"))
data_.years = localStorage.getItem("years").split(',');

const confix = new Confix()
const display_ = new Display()
const myDataTable = new MyDataTable()
const main_ = new Main()
