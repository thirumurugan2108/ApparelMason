import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { query } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Charts } from '../shared/chart';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
    selector: 'app-trend',
    templateUrl: './trend.component.html',
    styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit {
    overAllPanel: any;
    chart1: Charts;

    displayedColumns: string[] = ['States', 'Total Cases', 'New Cases', 'Total Deaths', 'New Deaths'];
    dataSource: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    // StateRecords: any;
    // dataSource = this.StateRecords;

    constructor(
        private afs: AngularFirestore,
        private datePipe: DatePipe) {

    }

    public barChartOptions: ChartOptions = {
        responsive: true,
        // scales: {
        // yAxes: [{
        //     ticks: {
        //         beginAtZero: true
        //     }
        // }]
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                stacked: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Total CoronaVirusCases',
                },
                gridLines: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                }
            }],
            xAxes: [
                {
                    gridLines: {
                        display: false
                    }
                }]
        }
        //  }
        ,
        devicePixelRatio: 0
    };

    public barChartOptions2: ChartOptions = {
        responsive: true,
        // scales: {
        // yAxes: [{
        //     ticks: {
        //         beginAtZero: true
        //     }
        // }]
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                stacked: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Total CoronaVirusDeaths',
                },
                gridLines: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                }
            }],
            xAxes: [
                {
                    gridLines: {
                        display: false
                    }
                }]
        }
        //  }
        ,
        devicePixelRatio: 0
    };
    public barChartLabels: Label[] = [];
    public barChart2Labels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];

    public barChartData: ChartDataSets[] = [
        {
            data: [],
            label: 'Cases',
            // barPercentage: 0.5,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "red",
            hoverBorderColor: "rgba(255,99,132,1)",
        }

        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    public barChart2Data: ChartDataSets[] = [
        {
            data: [],
            label: 'Deaths',
            // barPercentage: 0.8,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "red",
            hoverBorderColor: "rgba(255,99,132,1)",

        }

        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    ngOnInit() {
        this.afs.doc('COVID19/OverallPanel').valueChanges()
            .pipe(take(1)).subscribe(
                data => {
                    console.log(data);
                    this.overAllPanel = data;
                }
            );

        this.afs.collection<Charts>('COVID19/charts/chart1', ref =>
            ref.orderBy('index', "desc").limit(7)
        ).valueChanges().pipe(take(1)).subscribe(
            data => {
                
                data = data.reverse();
                data.forEach(data1 => {
                    this.chart1 = data1;
                    this.barChartData[0].data.push(this.chart1.count);
                    this.barChartLabels.push(this.datePipe.transform(this.chart1.chartDate, 'MMMM d'));
                });
            }
        );

        this.afs.collection<Charts>('COVID19/charts/chart2', ref =>
            ref.orderBy('index', "desc").limit(7)
        ).valueChanges().pipe(take(1)).subscribe( 
            data => {
                console.log(data);

                data = data.reverse();
                data.forEach(data1 => {
                    this.chart1 = data1;
                    this.barChart2Data[0].data.push(this.chart1.count);
                    this.barChart2Labels.push(this.datePipe.transform(this.chart1.chartDate, 'MMMM d'));
                });
            }
        );

        this.afs.collection('COVIDtable').valueChanges().pipe(take(1))
        .subscribe(data => {
            console.log(data);
            this.dataSource = new MatTableDataSource(data);
            // if (this.dataSource) {
                // this.dataSource.sort = this.sort;
            // }
        });
    }
}
