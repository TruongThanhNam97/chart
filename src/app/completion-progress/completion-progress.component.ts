import { CompletionProgressService } from "./completion-progress.service";
import { Component, OnInit } from "@angular/core";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { Subject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import undefined = require("firebase/empty-import");

@Component({
  selector: "app-completion-progress",
  templateUrl: "./completion-progress.component.html",
  styleUrls: ["./completion-progress.component.css"]
})
export class CompletionProgressComponent implements OnInit {
  myChart: any;
  data: any;
  arrTitle: any = [];
  arrStartEndDate: any = [];
  arrName: any = [];
  arrBudget: any = [];
  arrActual: any = [];
  arrActualWow: any = [];
  arrPerfectWell: any = [];
  wellBores: any = "";
  printedDate: any = "";
  destroySubscription$ = new Subject();
  url: any;

  ipadWidth = 1024;
  mobileWidth = 768;

  fontSizeTitle = 25;
  fontSizeSubtitle = 15;
  constructor(private completionProgressService: CompletionProgressService) {}

  ngOnInit() {
    
    /* Init chart */
    this.myChart = echarts.init(document.getElementById("chart"));
    /* List events to listen */
    this.myChart.on("dataZoom", (e: any) => {
      if (e.batch) {
        const [firstItem] = e.batch;
        if (firstItem.end - firstItem.start !== 100) {
          this.myChart.setOption({
            dataZoom: [
              {
                show: true
              },
              {
                show: true
              }
            ]
          });
        } else {
          this.myChart.setOption({
            dataZoom: [
              {
                show: false
              },
              {
                show: false
              }
            ]
          });
        }
      } else {
        if (e.end - e.start !== 100) {
          this.myChart.setOption({
            dataZoom: [
              {
                show: true
              },
              {
                show: true
              }
            ]
          });
        } else {
          this.myChart.setOption({
            dataZoom: [
              {
                show: false
              },
              {
                show: false
              }
            ]
          });
        }
      }
    });
    this.myChart.on("restore", (e: any) => {
      this.myChart.setOption({
        dataZoom: [
          {
            show: false
          },
          {
            show: false
          }
        ]
      });
    });

    if (document.documentElement.clientWidth <= this.ipadWidth) {
      this.fontSizeTitle = 20;
      this.fontSizeSubtitle = 10;
    }
    if (document.documentElement.clientWidth <= this.mobileWidth) {
      this.fontSizeTitle = 15;
      this.fontSizeSubtitle = 10;
    }

    fromEvent(window, "resize")
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe(v => {
        if (this.myChart !== null && this.myChart !== undefined && this.myChart.getOption() !== undefined  ) {
          if (document.documentElement.clientWidth <= this.ipadWidth) {
            this.fontSizeTitle = 20;
            this.fontSizeSubtitle = 10;
            this.myChart.setOption({
              title: [
                {
                  text: "Completion progress",
                  subtext: this.wellBores,
                  left: "center",
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: "black"
                  },
                  itemGap: 20
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "5%"
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "40%"
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "43%"
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "50%"
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "53%"
                }
              ]
            });
            this.myChart.resize();
          } else if (document.documentElement.clientWidth <= this.mobileWidth) {
            this.fontSizeTitle = 15;
            this.fontSizeSubtitle = 10;
            this.myChart.setOption({
              title: [
                {
                  text: "Completion progress",
                  subtext: this.wellBores,
                  left: "center",
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: "black"
                  },
                  itemGap: 20
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "5%"
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "40%"
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "43%"
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "50%"
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "53%"
                }
              ]
            });
            this.myChart.resize();
          } else {
            this.fontSizeTitle = 25;
            this.fontSizeSubtitle = 15;
            this.myChart.setOption({
              title: [
                {
                  text: "Completion progress",
                  subtext: this.wellBores,
                  left: "center",
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: "black"
                  },
                  itemGap: 20
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "5%"
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "40%"
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "43%"
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "50%"
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: "black",
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                  },
                  left: "87%",
                  top: "53%"
                }
              ]
            });
            this.myChart.resize();
          }
        }
      });

    fromEvent(document.getElementById("btnLoadData"), "click")
      .pipe(
        takeUntil(this.destroySubscription$),
        debounceTime(2000)
      )
      .subscribe(v => this.loadDataFromDB());
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  private splitName(arrName) {
    return arrName.reduce((acc, cur) => {
      if (cur.length > 50) {
        cur = cur.slice(0, 50) + "...";
      }
      const ob = {
        value: cur,
        textStyle: {
          color: "black",
          fontSize: 10
        }
      };
      acc.push(ob);
      return acc;
    }, []);
  }

  onChange(e) {
    this.resetData();
    / wire up file reader /;
    const target: DataTransfer = <DataTransfer>e.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      / read workbook /;
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      / Format date from execel /;
      delete wb.Sheets.Sheet1.C1.w;
      wb.Sheets.Sheet1.C1.z = "dd-MM-yyyy";
      XLSX.utils.format_cell(wb.Sheets.Sheet1.C1);

      / Get printed date /;
      this.printedDate = wb.Sheets.Sheet1.C1.w;

      / grab first sheet /;
      // const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets["Sheet1"];

      / save data /;
      this.data = <any>XLSX.utils.sheet_to_json(ws, { header: 1 });

      // this.completionProgressService.createChartData(this.data)

      this.data.forEach((item, index) => {
        if (index === 0) {
        } else if (index === 1) {
          this.arrTitle = [
            ...item.filter((v, i) => v !== null && v !== undefined && i <= 5)
          ];
        } else if (index === 2) {
          this.wellBores = item[7];
          this.arrStartEndDate = [
            ...item.filter((val, index) => index === 8 || index === 9)
          ];
        } else {
          this.arrName.push(item[0]);
          this.arrBudget.push(item[2]);
          this.arrActual.push(item[3]);
          this.arrActualWow.push(item[4]);
          this.arrPerfectWell.push(item[5]);
        }
      });
      this.arrName = this.splitName(this.arrName);
      this.arrTitle = this.arrTitle.reduce((acc, cur) => {
        let obj: any = {};
        if (cur === "Budget") {
          obj.name = "Budget";
          obj.icon =
            "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAGCAIAAAAOtlpdAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAI0lEQVR42mP4PygBw2B3VvXCc/6Ne4EIyBhwQYbRSBz6zgIAfmddgC2cnTMAAAAASUVORK5CYII=";
        }
        if (cur === "Actual") {
          obj.name = "Actual";
          obj.icon =
            "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAADCAIAAABee8vuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHUlEQVR42mP4PygBA4hwcPjPwDBYENAxUGcNPgAAIbdhrqW/VkcAAAAASUVORK5CYII=";
        }
        if (cur === "Actual w/o wow") {
          obj.name = "Actual w/o wow";
          obj.icon =
            "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAADCAIAAABee8vuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHklEQVR42mP4PygBAxC/nujxJIdrkCCgY6DOGoQAAA10cpKefYypAAAAAElFTkSuQmCC";
        }
        if (cur === "Perfect Well") {
          obj.name = "Perfect Well";
          obj.icon =
            "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAICAIAAAA5oktqAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAJUlEQVR42mP4P4gBw6jjKHbclJQdBQYLgAjIGCSCo9E66jh6AwDLPrDRE5yIGQAAAABJRU5ErkJggg==";
        }
        acc.push(obj);
        return acc;
      }, []);
      this.loadChart(
        this.arrTitle,
        this.arrName,
        this.arrBudget,
        this.arrActual,
        this.arrActualWow,
        this.arrPerfectWell,
        this.wellBores,
        this.arrStartEndDate,
        this.printedDate
      );
    };
    reader.readAsBinaryString(target.files[0]);
  }

  loadChart(
    arrTitle: any,
    arrName: any,
    arrBudget: any,
    arrActual: any,
    arrActualWow: any,
    arrPerfectWell: any,
    wellBores: any,
    startEndDate: any,
    printedDate: any
  ) {
    const options = {
      title: [
        {
          text: "Completion progress",
          subtext: wellBores,
          left: "center",
          textStyle: {
            fontSize: this.fontSizeTitle
          },
          subtextStyle: {
            fontSize: this.fontSizeSubtitle,
            color: "black"
          },
          itemGap: 20
        },
        {
          text: `Printed:\n\n${printedDate}`,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal"
          },
          left: "87%",
          top: "5%"
        },
        {
          text: `Start date:`,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal"
          },
          left: "87%",
          top: "40%"
        },
        {
          text: `${startEndDate[0]}`,
          borderColor: "black",
          borderWidth: 1,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal"
          },
          left: "87%",
          top: "43%"
        },
        {
          text: `End date:`,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal"
          },
          left: "87%",
          top: "50%"
        },
        {
          text: `${startEndDate[1]}`,
          borderColor: "black",
          borderWidth: 1,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal"
          },
          left: "87%",
          top: "53%"
        }
      ],
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: arrTitle,
        left: "87%",
        top: "20%",
        orient: "vertical",
        borderColor: "black",
        borderWidth: 1,
        itemGap: 20,
        symbolKeepAspect: false
      },
      grid: {
        left: "9%",
        right: "15%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
        show: true,
        borderWidth: 1,
        borderColor: "black",
        zlevel: 100,
        tooltip: {
          show: true,
          trigger: "axis",
          backgroundColor: "red"
        }
      },
      toolbox: {
        feature: {
          restore: {
            title: "Default"
          },
          saveAsImage: {
            title: "Save image"
          }
        },
        left: "5%",
        top: 0
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: arrName,
        name: "Benchmark sections",
        nameLocation: "center",
        nameTextStyle: {
          fontSize: 15,
          fontWeight: "bold",
          padding: [200, 0, 0, 0]
        },
        splitLine: {
          show: true,
          interval: 0,
          lineStyle: {
            type: "dashed",
            color: "#FFFF00"
          }
        },
        axisTick: {
          show: true,
          interval: 0,
          length: 3
        },
        axisLabel: {
          rotate: -65,
          margin: 10,
          showMaxLabel: true,
          showMinLabel: true
        }
      },
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "empty",
          // width: "20%",
          // right: 0,
          // top: 0,
          showDataShadow: false,
          showDetail: false,
          labelPrecision: 20,
          show: false,
          height: 15
        },
        {
          type: "slider",
          yAxisIndex: 0,
          filterMode: "empty",
          show: false,
          width: 15
        },
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "empty",
        },
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "empty"
        }
      ],
      yAxis: {
        type: "value",
        name: "Accumulated days",
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 15,
          fontWeight: "bold",
          padding: [0, 0, 100, 0]
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#FFCD00"
          }
        }
      },
      series: [
        {
          name: "Budget",
          type: "line",
          itemStyle: {
            color: "#4F81BD"
          },
          lineStyle: {
            type: "dashed"
          },
          data: arrBudget,
          symbol: "none"
        },
        {
          name: "Actual",
          type: "line",
          itemStyle: {
            color: "#FF0000"
          },
          data: arrActual,
          symbol: "none"
        },
        {
          name: "Perfect Well",
          type: "line",
          itemStyle: {
            color: "#7030A0"
          },
          lineStyle: {
            type: "dashed"
          },
          data: arrPerfectWell,
          symbol: "none"
        },
        {
          name: "Actual w/o wow",
          type: "line",
          itemStyle: {
            color: "#E46C0A"
          },
          data: arrActualWow,
          symbol: "none"
        }
      ]
    };
    this.myChart.setOption(options);
  }

  private resetData() {
    this.arrActual = [];
    this.arrActualWow = [];
    this.arrBudget = [];
    this.arrName = [];
    this.arrPerfectWell = [];
  }

  loadDataFromDB() {
    this.resetData();
    this.myChart.showLoading();
    this.completionProgressService.getData().subscribe((source: any) => {
      const dataSource = source.payload.val();
      const result = Object.keys(dataSource).map(k => dataSource[k])[0];
      result.data.map(item => {
        this.arrActual = [...this.arrActual, item.actual];
        this.arrActualWow = [...this.arrActualWow, item.actualWow];
        this.arrBudget = [...this.arrBudget, item.budget];
        this.arrPerfectWell = [...this.arrPerfectWell, item.perfectWell];
        this.arrName = [...this.arrName, item.name];
      });
      this.arrStartEndDate = result.startEndDate;
      this.wellBores = result.wellBores;
      this.arrTitle = result.title;
      this.arrName = this.splitName(this.arrName);
      this.loadChart(
        this.arrTitle,
        this.arrName,
        this.arrBudget,
        this.arrActual,
        this.arrActualWow,
        this.arrPerfectWell,
        this.wellBores,
        this.arrStartEndDate,
        this.printedDate
      );
      this.myChart.hideLoading();
    });
  }

  onClick() {
    if (this.myChart !== null && this.myChart !== undefined) {
      let x = document.documentElement.clientWidth / 2;
      let y = document.documentElement.clientHeight / 2;
      let printContents, popupWin;
      printContents = document.getElementById("chart").innerHTML;
      popupWin = window.open(
        "",
        "_blank",
        `top=${y - 500 / 2},left=${x - 500 / 2},width=500,height=500`
      );
      popupWin.document.open();
      popupWin.document.write(`
        <html>
        <body onload="window.print();window.close()">
          <div style="width:1000px;margin:auto;">
          <img src=${this.myChart.getDataURL()} alt="CHART" style="width:100%;">
          </div>
        </body>
        </html>`);
      popupWin.document.close();
    }
  }
}
