import { CompletionProgressService } from './completion-progress.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { Subject, fromEvent, interval } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-completion-progress',
  templateUrl: './completion-progress.component.html',
  styleUrls: ['./completion-progress.component.css']

})
export class CompletionProgressComponent implements OnInit, OnDestroy {
  myChart: any;
  data: any;
  arrTitle: any = [];
  arrStartEndDate: any = [];
  arrName: any = [];
  arrBudget: any = [];
  arrActual: any = [];
  arrActualWow: any = [];
  arrPerfectWell: any = [];
  wellBores: any = '';
  printedDate: any = '';
  destroySubscription$ = new Subject();
  url: any;
  addTriangleMode = true;

  ipadWidth = 1024;
  mobileWidth = 768;

  fontSizeTitle = 25;
  fontSizeSubtitle = 15;
  constructor(private completionProgressService:
    CompletionProgressService) { }

  ngOnInit() {
    /* Init chart */
    this.myChart = echarts.init(document.getElementById('chart'));
    /* List events to listen */
    this.myChart.on('dataZoom', (e: any) => {
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
            title: [],
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
    this.myChart.on('restore', (e: any) => {
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
    this.myChart.on('click', { seriesId: 'actualLine' }, e => {
      if (this.addTriangleMode) {
        const index = e['dataIndex'];
        if (!this.arrActual[index].symbol) {
          this.arrActual[index] = {
            value: e.data,
            symbol: 'triangle',
            symbolSize: 30,
            itemStyle: {
              color: '#FFC000',
              barBorderWidth: 1,
              barBorderColor: 'black',
              opacity: 0.7
            }
          };
          this.arrTitle.push({
            name: 'Incident report',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE8SURBVFhH7ZA7bsJQEEUp2R1LyfbogrKBFClTUKZLCgqUanIt+RZYfn7zubaC4EhHQnjmaXR2dgc86JHfx/GHDu2Rv19mb3uzy/v4hwbtkZ8vZic8+XEY/9CgO5IVhyMHhTV1R7IiFdbUHDmtSEU1NUdOK1JRTbxUpFWRCmrilSKtilRQE68U6FWkxZp4oUCvIi3WxAtJvBVpoSa2k3gr0kJNbCeIVqTJmthMEK1IkzWxGSRbkSZqYitItiJN1MRWgGpFGqyJjQDVijRYExtOVBVpoCamnagq0kBNTDtQV6TOmph0oK5InTUx2WGtitRRE1Md1qpIHTUxtcDaFWmnJiYWWLsi7dTERIOtKtKFmvjaYKuKdKEmvs6wdUXaqIkvMwxH/rxu7/U8HnDL/JH/jOeRKp5HqriDI83+AJGrtRvMNT73AAAAAElFTkSuQmCC'
          });
          this.myChart.setOption({
            legend: {
              data: this.arrTitle
            },
            series: [
              {
                name: 'Actual',
                type: 'line',
                itemStyle: {
                  color: '#FF0000'
                },
                data: this.arrActual,
                id: 'actualLine'
              }
            ]
          });
        }
        const buttonClose = document.getElementById('btnClose');
        const chartEle = document.getElementById('chart');
        const buttonEdit = document.getElementById('btnEdit');
        if (buttonClose) {
          buttonClose.addEventListener('click', () => {
            chartEle.children[1].removeChild(buttonClose.parentElement);
          });
        }
        if (buttonEdit) {
          buttonEdit.parentElement.children[0].addEventListener(
            'change',
            (e: any) => console.log(e.srcElement.value)
          );
          buttonEdit.addEventListener('click', () => {
            buttonEdit.parentElement.children[0].classList.remove('disappear');
            buttonEdit.parentElement.children[1].classList.add('disappear');
            (<HTMLDivElement>buttonEdit.parentElement.children[0]).focus();
          });
        }
      }
    });
    this.myChart.on('legendselectchanged', e => {
      if (e.name === 'Incident report') {
        if (e.selected['Incident report']) {
          this.addTriangleMode = true;
          this.arrActual = this.arrActual.map(val => {
            if (val.symbol) {
              val.symbol = 'triangle';
            }
            return val;
          });
          this.myChart.setOption({
            series: [
              {
                name: 'Actual',
                type: 'line',
                itemStyle: {
                  color: '#FF0000'
                },
                data: this.arrActual,
                id: 'actualLine',
                cursor: 'pointer',
                silent: false
              }
            ]
          });
        } else {
          this.addTriangleMode = false;
          this.arrActual = this.arrActual.map(val => {
            if (val.symbol) {
              val.symbol = 'none';
            }
            return val;
          });
          this.myChart.setOption({
            series: [
              {
                name: 'Actual',
                type: 'line',
                itemStyle: {
                  color: '#FF0000'
                },
                data: this.arrActual,
                id: 'actualLine',
                cursor: 'pointer',
                silent: false
              }
            ]
          });
        }
      }
    });

    if (document.documentElement.clientWidth <= this.ipadWidth) {
      this.fontSizeTitle = 20;
      this.fontSizeSubtitle = 10;
    }
    if (document.documentElement.clientWidth <= this.mobileWidth) {
      this.fontSizeTitle = 15;
      this.fontSizeSubtitle = 10;
    }

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe(v => {
        if (
          this.myChart !== null &&
          this.myChart !== undefined &&
          this.myChart.getOption() !== undefined
        ) {
          if (document.documentElement.clientWidth <= this.ipadWidth) {
            this.fontSizeTitle = 20;
            this.fontSizeSubtitle = 10;
            this.myChart.setOption({
              title: [
                {
                  text: 'Completion progress',
                  subtext: this.wellBores,
                  left: 'center',
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: 'black'
                  },
                  itemGap: 20
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '5%'
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '40%'
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '43%'
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '50%'
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '53%'
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
                  text: 'Completion progress',
                  subtext: this.wellBores,
                  left: 'center',
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: 'black'
                  }
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '5%'
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '40%'
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '43%'
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '50%'
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '53%'
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
                  text: 'Completion progress',
                  subtext: this.wellBores,
                  left: 'center',
                  textStyle: {
                    fontSize: this.fontSizeTitle
                  },
                  subtextStyle: {
                    fontSize: this.fontSizeSubtitle,
                    color: 'black'
                  },
                  itemGap: 20
                },
                {
                  text: `Printed:\n\n${this.printedDate}`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '5%'
                },
                {
                  text: `Start date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '40%'
                },
                {
                  text: `${this.arrStartEndDate[0]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '43%'
                },
                {
                  text: `End date:`,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '50%'
                },
                {
                  text: `${this.arrStartEndDate[1]}`,
                  borderColor: 'black',
                  borderWidth: 1,
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal'
                  },
                  left: '87%',
                  top: '53%'
                }
              ]
            });
            this.myChart.resize();
          }
        }
      });

    fromEvent(document.getElementById('btnLoadData'), 'click')
      .pipe(takeUntil(this.destroySubscription$))
      .subscribe(v => this.loadDataFromDB());
    // fromEvent(document.getElementById("chart"), "click")
    //   .pipe(takeUntil(this.destroySubscription$))
    //   .subscribe(v => console.log(v));
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  private splitName(arrName) {
    return arrName.reduce((acc, cur) => {
      if (cur.length > 50) {
        cur = cur.slice(0, 50) + '...';
      }
      const ob = {
        value: cur,
        textStyle: {
          color: 'black',
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
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      / read workbook /;
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      / Format date from execel /;
      delete wb.Sheets.Sheet1.C1.w;
      wb.Sheets.Sheet1.C1.z = 'dd-MM-yyyy';
      XLSX.utils.format_cell(wb.Sheets.Sheet1.C1);

      / Get printed date /;
      this.printedDate = wb.Sheets.Sheet1.C1.w;

      / grab first sheet /;
      const ws: XLSX.WorkSheet = wb.Sheets['Sheet1'];

      / save data /;
      this.data = <any>XLSX.utils.sheet_to_json(ws, { header: 1 });

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
      // this.arrName = this.splitName(this.arrName);
      this.arrTitle = this.arrTitle.reduce((acc, cur) => {
        const obj: any = {};
        if (cur === 'Budget') {
          obj.name = 'Budget';
          obj.icon =
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAGCAIAAAAOtlpdAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAI0lEQVR42mP4PygBw2B3VvXCc/6Ne4EIyBhwQYbRSBz6zgIAfmddgC2cnTMAAAAASUVORK5CYII=';
        }
        if (cur === 'Actual') {
          obj.name = 'Actual';
          obj.icon =
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAADCAIAAABee8vuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHUlEQVR42mP4PygBA4hwcPjPwDBYENAxUGcNPgAAIbdhrqW/VkcAAAAASUVORK5CYII=';
        }
        if (cur === 'Actual w/o wow') {
          obj.name = 'Actual w/o wow';
          obj.icon =
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAADCAIAAABee8vuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAHklEQVR42mP4PygBAxC/nujxJIdrkCCgY6DOGoQAAA10cpKefYypAAAAAElFTkSuQmCC';
        }
        if (cur === 'Perfect Well') {
          obj.name = 'Perfect Well';
          obj.icon =
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAICAIAAAA5oktqAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAJUlEQVR42mP4P4gBw6jjKHbclJQdBQYLgAjIGCSCo9E66jh6AwDLPrDRE5yIGQAAAABJRU5ErkJggg==';
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
    console.log([...arrActual, ...arrActualWow, ...arrBudget, ...arrPerfectWell]);
    const options = {
      title: [
        {
          text: 'Completion progress',
          subtext: wellBores,
          left: 'center',
          textStyle: {
            fontSize: this.fontSizeTitle,
            height  : '{a|}',
            rich : {
              a : {
                color : 'red',
                backgroundColor : 'yellow',
                height : 50,
                width : 'auto'
              }
            }
          },
          subtextStyle: {
            fontSize: this.fontSizeSubtitle,
            color: 'black'
          },
          top: 0
        },
        {
          text: `Printed:\n\n${printedDate}`,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          },
          right: 25,
          top: '5%'
        },
        {
          text: `Start date:`,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          },
          right: 25,
          bottom: '33%'
        },
        {
          text: `${startEndDate[0]}`,
          borderColor: 'black',
          borderWidth: 1,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          },
          right: 25,
          bottom: '30%'
        },
        {
          text: `End date:`,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          },
          right: 25,
          bottom: '23%'
        },
        {
          text: `${startEndDate[1]}`,
          borderColor: 'black',
          borderWidth: 1,
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          },
          right: 25,
          bottom: '20%'
        }
      ],
      tooltip: {
        trigger: 'axis',
        triggerOn: 'mousemove|click',
        formatter: params => {
          let isActualLineExists = false;
          let isSymbolsExist = false;
          const name = params[0].name;
          let budget = '-';
          let actual = '-';
          let actualwow = '-';
          let perfectWell = '-';
          for (let i = 0; i < params.length; i++) {
            if (params[i].data && params[i].data.symbol) {
              isSymbolsExist = true;
            }
            if (params[i].seriesName === 'Actual' && params[i].data) {
              isActualLineExists = true;
              actual = params[i].data;
            }
            if (params[i].seriesName === 'Budget' && params[i].data) {
              budget = params[i].data;
            }
            if (params[i].seriesName === 'Perfect Well' && params[i].data) {
              perfectWell = params[i].data;
            }
            if (params[i].seriesName === 'Actual w/o wow' && params[i].data) {
              actualwow = params[i].data;
            }
          }
          if (isActualLineExists && isSymbolsExist) {
            return `    <div
            class="block"
          >
          <textarea
              class = "editMessage disappear"
              name="mes"
              cols="30"
              rows="10"
              maxLength = "180"
            ></textarea>
          <div class="showMessage">Messages Ahiih sakdaskdjsakl sajdsalkdjsalkdj asjdlksadlkasjd lạdslakjdsalk</div>
            <div id="btnClose" style="position: absolute;right: 0;top: 0;background: transparent;cursor: pointer;">X</div>
            <div id="btnEdit" style="top: 20px;right: 0;position: absolute;background: transparent;cursor: pointer;">...</div>
          </div>`;
          } else {
            return `
            ${name}<br /><span
              style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#4F81BD;"
            ></span
            >Budget: ${budget}<br /><span
              style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FF0000;"
            ></span
            >Actual: ${actual}<br /><span
              style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#7030A0;"
            ></span
            >Perfect Well: ${perfectWell}<br /><span
              style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#E46C0A;"
            ></span
            >Actual w/o wow: ${actualwow}
          `;
          }
        },
        enterable: true,
        textStyle: {
          color: '#000'
        },
        transitionDuration: 0,
        confine: true,
        extraCssText: 'background-color : #dededebd;white-space:normal;font-size:12px;width:150px;'
      },
      legend: {
        data: arrTitle,
        right: 25,
        top: '20%',
        orient: 'vertical',
        borderColor: 'black',
        borderWidth: 1,
        symbolKeepAspect: false,
        itemWidth: 25,
        padding: 5,
        textStyle: {
          width: 100
        }
      },
      grid: {
        right: 170,
        top: '10%',
        left: '10%',
        containLabel: true,
        show: true,
        borderWidth: 1,
        borderColor: 'black',
        zlevel: 100
      },
      toolbox: {
        feature: {
          restore: {
            title: 'Default'
          },
          saveAsImage: {
            title: 'Save image'
          },
          myPencil: {
            show: true,
            title: 'Pencil',
            icon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAXCAYAAAAV1F8QAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALLSURBVEhL3ZRdKPNhGMZnNRQ5sLAkNaW1UpQaR5ITHznQDpSlHC2HaFHKAeWrHVBzMCUHlJYopW21Aw5YQjZaYq2ozYHiQFHkI9fbfe0vr7Z5x6v34L3qX//nep7uX8/93Petwj/Sj4BmZmagUqlgs9kUJ1F/DRocHERWVhYcDgfy8/PR39+v7HzUt0GPj4/wer0YHh6GWq3G/v4+jo6O+D8+Pq6cete3QALp7Oxkuvx+P6amppCZmYmTkxNsbm7Sdzqdyum4vgy6u7tDW1sbg/X19eH5+Zl+b28vcnNzEYvFsLKywn2328090ZdA19fXaGhoYJCRkRF6Ly8vmJubw9XVFbq6uqDT6XBzc4PJyUlkZGTwjCht0MXFBaqrqwmZnp6mJyns6Oigt7S0RM9sNsNgMKC2thYtLS30RGmBIpEIjEYjA87Pz9O7vb1Fa2srvYGBATw9PfF24XAYdXV1qK+vx8PDA8+KVK+vr8pvckkllZaWsppWV1fpSZokmEDGxsboSRwpkJKSEoRCIYJ/16eg7e1taLVa5OTkwOfz0YtGo6iqqiJEGlV0f3+P9vZ2et3d3R9u8qaUqROIVFFBQQF2dnbonZ6eory8nAEXFhboycM3NjbSGxoaopdMKUHNzc2ESBpEgUAAxcXF0Gg0WFtbo3d5eclHF4jdbqeXSklTJ2UsY2V0dJRracq8vDx+Gxsb9M7Pz1FRUUHI7Owsvc+UFLS8vMwAUgiiiYkJpmxvb4/r4+Nj6PV6nnG5XPT+pKQgi8WCyspKZRXvFyld0e7uLgoLC5GdnQ2Px0MvHSW8kZRlUVERampqcHZ2prjxCbC+vs4KlCm9tbWl7KSnBFAwGOTokLRIQ8rAlG4XuHhlZWU4PDxUTqevBJA0oAR8++QGJpMJPT09fA8plO8oAdTU1ASr1YrFxUUcHBxw1PyEUvbRT+t/AwG/AM8XIAlirErTAAAAAElFTkSuQmCC',
            onclick: () => {
              const body = document.getElementsByTagName('html')[0];
              const canvasElements = document.getElementsByTagName('canvas');
              if (
                this.myChart.getOption().tooltip[0].triggerOn ===
                'mousemove|click'
              ) {
                this.myChart.setOption({
                  tooltip: {
                    triggerOn: 'click'
                  }
                });
              } else {
                this.myChart.setOption({
                  tooltip: {
                    triggerOn: 'mousemove|click'
                  }
                });
              }
              if (this.myChart.getOption().series[1].symbol === 'none') {
                body.style.cursor = 'pointer';
                for (let i = 0; i < canvasElements.length; i++) {
                  canvasElements[i].style.cursor = 'pointer';
                }
                // this.arrTitle.push({
                //   name: 'Incident report',
                //   icon:
                //     'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE8SURBVFhH7ZA7bsJQEEUp2R1LyfbogrKBFClTUKZLCgqUanIt+RZYfn7zubaC4EhHQnjmaXR2dgc86JHfx/GHDu2Rv19mb3uzy/v4hwbtkZ8vZic8+XEY/9CgO5IVhyMHhTV1R7IiFdbUHDmtSEU1NUdOK1JRTbxUpFWRCmrilSKtilRQE68U6FWkxZp4oUCvIi3WxAtJvBVpoSa2k3gr0kJNbCeIVqTJmthMEK1IkzWxGSRbkSZqYitItiJN1MRWgGpFGqyJjQDVijRYExtOVBVpoCamnagq0kBNTDtQV6TOmph0oK5InTUx2WGtitRRE1Md1qpIHTUxtcDaFWmnJiYWWLsi7dTERIOtKtKFmvjaYKuKdKEmvs6wdUXaqIkvMwxH/rxu7/U8HnDL/JH/jOeRKp5HqriDI83+AJGrtRvMNT73AAAAAElFTkSuQmCC'
                // });
                this.myChart.setOption({
                  series: [
                    {
                      name: 'Actual',
                      type: 'line',
                      itemStyle: {
                        color: '#FF0000'
                      },
                      data: this.arrActual,
                      id: 'actualLine',
                      symbol: 'rect'
                    }
                  ]
                });
              } else {
                body.style.cursor = 'unset';
                for (let i = 0; i < canvasElements.length; i++) {
                  canvasElements[i].style.cursor = 'unset';
                }
                // this.arrTitle = this.arrTitle.filter((v, i) => i !== 4);
                this.myChart.setOption({
                  series: [
                    {
                      name: 'Actual',
                      type: 'line',
                      itemStyle: {
                        color: '#FF0000'
                      },
                      data: this.arrActual,
                      id: 'actualLine',
                      symbol: 'none'
                    }
                  ]
                });
              }
            }
          }
        },
        left: '5%',
        top: 0
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: arrName,
        name: 'Benchmark sections',
        nameLocation: 'center',
        nameTextStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          padding: [500, 0, 0, 0]
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#FFFF00'
          }
        },
        axisTick: {
          show: true,
          length: 3
        },
        axisLabel: {
          rotate: -65,
          margin: 10,
          showMaxLabel: true,
          showMinLabel: true,
          formatter: (value, index) => {
            console.log(this.myChart.getHeight());
            if (this.myChart.getHeight() < 300) {
              console.log('ok');
              return '';
            }
            return value.slice(0, 30) + '...';
          }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
          showDataShadow: false,
          showDetail: false,
          labelPrecision: 20,
          show: false,
          height: 15
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'empty',
          show: false,
          width: 15,
          right: 0
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'empty'
        }
      ],
      yAxis: {
        type: 'value',
        name: 'Accumulated days',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          padding: [0, 0, 100, 0]
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#FFCD00'
          }
        }
      },
      series: [
        {
          name: 'Budget',
          type: 'line',
          lineStyle: {
            type: 'dashed',
            color: '#4F81BD'
          },
          data: arrBudget,
          symbol: 'none'
        },
        {
          name: 'Actual',
          type: 'line',
          data: arrActual,
          id: 'actualLine',
          lineStyle: {
            color: 'red'
          },
          showSymbol: true,
          symbol: 'none'
        },
        {
          name: 'Perfect Well',
          type: 'line',
          lineStyle: {
            type: 'dashed',
            color: '#7030A0'
          },
          data: arrPerfectWell,
          symbol: 'none'
        },
        {
          name: 'Actual w/o wow',
          type: 'line',
          lineStyle: {
            color: '#E46C0A'
          },
          data: arrActualWow,
          symbol: 'none'
        },
        {
          name: 'Incident report',
          type: 'line'
        }
      ]
    };
    this.myChart.setOption(options);
    console.log(this.myChart.getOption().yAxis);
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
    console.log(this.myChart.getWidth());
    console.log(this.myChart.getHeight());
    console.log(this.myChart.getDom());
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
      // this.arrName = this.splitName(this.arrName);
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
      console.log(this.myChart.getWidth());
      console.log(this.myChart.getHeight());
    });
  }

  onClick() {
    if (this.myChart !== null && this.myChart !== undefined) {
      const x = document.documentElement.clientWidth / 2;
      const y = document.documentElement.clientHeight / 2;
      let printContents, popupWin;
      printContents = document.getElementById('chart').innerHTML;
      popupWin = window.open(
        '',
        '_blank',
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
  findMaxValue(arrVal: any) {
    let result = 0;
    arrVal.forEach(val => {
      if (typeof val === 'number' && result < val) {
        result = val;
      }
    });
    let number = result / 5;
    let i = 1;
    while (true) {
      if (number / 10 <= 0) {
        break;
      }
      number /= 10;
      i *= 10;
    }
    number = Math.round(number) * i;
    return result;
  }
}
