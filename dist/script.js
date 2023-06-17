
/* Lấy data tất cả môn học và cho vào bảng*/

/* Tạo tất cả trường hợp khi click vào vào nhóm*/


// Lấy tham chiếu đến phần tử <div> có lớp 'table-data-cr'
function createTableData(){
    var htmlToAdd = `
      <nav style="display: flex;">
        <label for="courseFilter">Chọn mã học phần:</label>
        <select id="courseFilter">
          <option value="">Tất cả</option>
        </select>
        <input type="checkbox" name="" id="click-all-groups">
        <div id="selectedCourseName"></div>
      </nav>
    
      <table id="myTable">
        <thead>
          <tr>
            <th style="display:block;">Mã HP</th>
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



// Mã HTML bạn muốn thêm

// Thêm mã HTML vào phần tử <div>




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
        console.log(this.results);
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
}

// class FixTable {
//     constructor(){

//     }
// }




// const table_ = new FixTable()


class Data_ {
    constructor() {
        this.all_combinations = [];
        this.dataHK = [];
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
            });

            $("#courseFilter").append(`<option value="${item.maHP}">${item.maHP}</option>`);
        });

        // Vẽ lại bảng sau khi tải dữ liệu
        this.table.draw();
    }

    uploadData(newData) {
        this.table.clear();
        this.loadData(newData);
    }

    toggleAllGroups() {
        const isChecked = $('#click-all-groups').prop('checked');
        $('#myTable tbody input[type="checkbox"]').prop('checked', isChecked);
    
        const rows = this.table.rows({ search: 'applied' }).nodes();
        $(rows).each((index, row) => {
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
                tenHP: item.tenHP,
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
    
        dataps_.generateCombinations(filteredData);
        // dataps_.createAllTkb()
        return filteredData;
    }
  
    filterByCourse() {
        const selectedCourse = $('#courseFilter').val();
    
        try {
            const selectedCourseName = this.data.find((item) => item.maHP === selectedCourse).tenHP;
            $("#selectedCourseName").text("Môn học đã chọn: " + selectedCourseName);
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


const data_ = new Data_();
const dataps_ = new DataProcessor()
const myDataTable = new MyDataTable();

createTableData()
myDataTable.initialize();

const initialData = [
    {
        "maHP": "KC118",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "6",
                "tiet_bd": 6,
                "so_tiet": 3,
                "phong": "208/B1",
                "si_so": 70,
                "si_so_con_lai": 17,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "KC118001",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "KC356",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "5",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "206/B1",
                "si_so": 90,
                "si_so_con_lai": 3,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "KC356001",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "CN151",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "5",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "105/A3",
                "si_so": 77,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "CN151001",
                "status_nhom": true
            },
            {
                "ki_hieu": "02",
                "thu": "2",
                "tiet_bd": 4,
                "so_tiet": 2,
                "phong": "206/B1",
                "si_so": 92,
                "si_so_con_lai": 1,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "CN151002",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "KC346",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "2",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "204/B1",
                "si_so": 90,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "KC346001",
                "status_nhom": true
            },
            {
                "ki_hieu": "01",
                "thu": "3",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "211/B1",
                "si_so": 90,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "KC346001",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "ML018",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "2",
                "tiet_bd": 4,
                "so_tiet": 2,
                "phong": "HT/KSP",
                "si_so": 201,
                "si_so_con_lai": 1,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01801",
                "status_nhom": true
            },
            {
                "ki_hieu": "02",
                "thu": "6",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "102/KH",
                "si_so": 160,
                "si_so_con_lai": 1,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01802",
                "status_nhom": true
            },
            {
                "ki_hieu": "03",
                "thu": "6",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "102/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01803",
                "status_nhom": true
            },
            {
                "ki_hieu": "04",
                "thu": "5",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "103/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01804",
                "status_nhom": true
            },
            {
                "ki_hieu": "05",
                "thu": "2",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "101/KT",
                "si_so": 200,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01805",
                "status_nhom": true
            },
            {
                "ki_hieu": "06",
                "thu": "6",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "103/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01806",
                "status_nhom": true
            },
            {
                "ki_hieu": "07",
                "thu": "5",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "201/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01807",
                "status_nhom": true
            },
            {
                "ki_hieu": "08",
                "thu": "5",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "101/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01808",
                "status_nhom": true
            },
            {
                "ki_hieu": "09",
                "thu": "3",
                "tiet_bd": 4,
                "so_tiet": 2,
                "phong": "107/C1",
                "si_so": 210,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01809",
                "status_nhom": true
            },
            {
                "ki_hieu": "10",
                "thu": "4",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "101/KT",
                "si_so": 200,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01810",
                "status_nhom": true
            },
            {
                "ki_hieu": "11",
                "thu": "3",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "103/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01811",
                "status_nhom": true
            },
            {
                "ki_hieu": "12",
                "thu": "3",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "102/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01812",
                "status_nhom": true
            },
            {
                "ki_hieu": "13",
                "thu": "4",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "HT/KSP",
                "si_so": 200,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01813",
                "status_nhom": true
            },
            {
                "ki_hieu": "14",
                "thu": "5",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "202/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01814",
                "status_nhom": true
            },
            {
                "ki_hieu": "15",
                "thu": "5",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "201/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01815",
                "status_nhom": true
            },
            {
                "ki_hieu": "16",
                "thu": "3",
                "tiet_bd": 1,
                "so_tiet": 2,
                "phong": "102/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01816",
                "status_nhom": true
            },
            {
                "ki_hieu": "17",
                "thu": "2",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "101/KT",
                "si_so": 200,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01817",
                "status_nhom": true
            },
            {
                "ki_hieu": "18",
                "thu": "3",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "101/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01818",
                "status_nhom": true
            },
            {
                "ki_hieu": "19",
                "thu": "3",
                "tiet_bd": 8,
                "so_tiet": 2,
                "phong": "103/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01819",
                "status_nhom": true
            },
            {
                "ki_hieu": "20",
                "thu": "2",
                "tiet_bd": 6,
                "so_tiet": 2,
                "phong": "201/KH",
                "si_so": 160,
                "si_so_con_lai": 0,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "ML01820",
                "status_nhom": true
            },
            {
                "ki_hieu": "H01",
                "thu": "7",
                "tiet_bd": 2,
                "so_tiet": 4,
                "phong": "101/HA",
                "si_so": 90,
                "si_so_con_lai": 10,
                "tuan_hoc": "12345678*************",
                "lop_hp": "21V1A5",
                "status_nhom": true
            },
            {
                "ki_hieu": "H02",
                "thu": "6",
                "tiet_bd": 2,
                "so_tiet": 4,
                "phong": "104/HA",
                "si_so": 80,
                "si_so_con_lai": 13,
                "tuan_hoc": "12345678*************",
                "lop_hp": "21U7A5",
                "status_nhom": true
            },
            {
                "ki_hieu": "H03",
                "thu": "7",
                "tiet_bd": 2,
                "so_tiet": 4,
                "phong": "101/HA",
                "si_so": 90,
                "si_so_con_lai": 47,
                "tuan_hoc": "********9012345******",
                "lop_hp": "2123A5",
                "status_nhom": true
            },
            {
                "ki_hieu": "H04",
                "thu": "6",
                "tiet_bd": 2,
                "so_tiet": 4,
                "phong": "201HA6",
                "si_so": 80,
                "si_so_con_lai": 3,
                "tuan_hoc": "********9012345******",
                "lop_hp": "2122A5",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "CN100",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "6",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "308/CN",
                "si_so": 90,
                "si_so_con_lai": 34,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "CN100001",
                "status_nhom": true
            },
            {
                "ki_hieu": "02",
                "thu": "4",
                "tiet_bd": 6,
                "so_tiet": 3,
                "phong": "308/CN",
                "si_so": 91,
                "si_so_con_lai": 4,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "CN100002",
                "status_nhom": true
            },
            {
                "ki_hieu": "03",
                "thu": "5",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "109/B1",
                "si_so": 60,
                "si_so_con_lai": 13,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "CN100003",
                "status_nhom": true
            },
            {
                "ki_hieu": "C01",
                "thu": "2",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "109/B1",
                "si_so": 5,
                "si_so_con_lai": 0,
                "tuan_hoc": "*********0123**678***",
                "lop_hp": "22T6A1",
                "status_nhom": true
            },
            {
                "ki_hieu": "C01",
                "thu": "4",
                "tiet_bd": 4,
                "so_tiet": 2,
                "phong": "111/B1",
                "si_so": 5,
                "si_so_con_lai": 0,
                "tuan_hoc": "*********0123**678***",
                "lop_hp": "22T6A1",
                "status_nhom": true
            },
            {
                "ki_hieu": "D01",
                "thu": "5",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "104/B1",
                "si_so": 5,
                "si_so_con_lai": 0,
                "tuan_hoc": "*********012345**8***",
                "lop_hp": "22Z5A1",
                "status_nhom": true
            },
            {
                "ki_hieu": "D01",
                "thu": "6",
                "tiet_bd": 4,
                "so_tiet": 2,
                "phong": "103/B1",
                "si_so": 5,
                "si_so_con_lai": 0,
                "tuan_hoc": "*********012345**8***",
                "lop_hp": "22Z5A1",
                "status_nhom": true
            },
            {
                "ki_hieu": "M01",
                "thu": "7",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "314ATL",
                "si_so": 40,
                "si_so_con_lai": 10,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "TN21T5F1",
                "status_nhom": true
            },
            {
                "ki_hieu": "M02",
                "thu": "3",
                "tiet_bd": 1,
                "so_tiet": 3,
                "phong": "314ATL",
                "si_so": 40,
                "si_so_con_lai": 19,
                "tuan_hoc": "123456789012345******",
                "lop_hp": "TN21T5F2",
                "status_nhom": true
            }
        ]
    },
    {
        "maHP": "CN169",
        "data": [
            {
                "ki_hieu": "01",
                "thu": "<b>Không có thời khóa biểu</b>",
                "tiet_bd": 100,
                "so_tiet": 56,
                "phong": "123456789012345******",
                "si_so": null,
                "si_so_con_lai": 2,
                "tuan_hoc": "M01",
                "lop_hp": "<b>Không có thời khóa biểu</b>",
                "status_nhom": true
            }
        ]
    }
]

data_.dataHK = initialData
myDataTable.uploadData(data_.dataHK);
    
    
  

   