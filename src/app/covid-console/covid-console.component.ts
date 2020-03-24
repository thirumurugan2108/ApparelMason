import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { CoronaRecords } from '../shared/CoronaRecords';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-covid-console',
  templateUrl: './covid-console.component.html',
  styleUrls: ['./covid-console.component.css']
})
export class CovidConsoleComponent {

  contactForm: FormGroup;
  chartForm1: FormGroup;
  chartForm2: FormGroup;
  tableForm: FormGroup;
  test: CoronaRecords;
  testDate: Date;
  categoryList: string[] = [
    'Maharashtra',
    'Kerala',
    'Delhi',
    'UttarPradesh',
    'Rajasthan',
    'Telangana',
    'Karnataka',
    'Haryana',
    'Gujarat',
    'Ladakh',
    'Punjab',
    'TamilNadu',
    'Chandigarh',
    'AndhraPradesh',
    'J&K',
    'WestBengal',
    'MadhyaPradesh',
    'Uttarakhand',
    'Odisha',
    'HimachalPradesh',
    'Puducherry',
    'Chhattisgarh',
    'Bihar'
  ];
  constructor(private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) {
    this.contactForm = this.createFormGroup(formBuilder);
    this.chartForm1 = this.createChartForm1(formBuilder);
    this.chartForm2 = this.createChartForm2(formBuilder);
    this.tableForm = this.createTableForm(formBuilder);
  }

  createTableForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      states: new FormControl(),
      // tableVersion: new FormControl(),
      totalCase: new FormControl(),
      newCase: new FormControl(),
      totalDeath: new FormControl(),
      newDeath: new FormControl()
    });
  }

  createChartForm1(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      dateChart1: new FormControl(),
      countChart1: new FormControl()
    });
  }

  createChartForm2(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      dateChart2: new FormControl(),
      countChart2: new FormControl()
    });
  }

  createFormGroup(formBuilder: FormBuilder) {
    return formBuilder.group({
      OverAllIndiaCases: new FormControl(''),
      OverAllIndiaDeaths: new FormControl(''),
      OverAllIndiaRecovered: new FormControl(''),
      TotalCases: new FormControl(''),
      TotalDeaths: new FormControl(''),
      TodaysIndiaCases: new FormControl(''),
      TodaysIndiaDeaths: new FormControl(''),
      TodaysWorldCases: new FormControl(''),
      TodaysWorldDeaths: new FormControl(''),
    });
  }

  saveRecords() {
    console.log(this.contactForm.value);
    this.test = this.contactForm.value;
    console.log(this.test);

    this.afs.doc('COVID19/OverallPanel').update(this.contactForm.value);
  }

  saveChart1() {
    this.testDate = this.chartForm1.value.dateChart1;
    console.log(this.datePipe.transform(this.testDate, 'MMMM d, y'));
    const testDate1 = this.datePipe.transform(this.testDate, 'MMMM d, y');
    this.afs.doc(`COVID19/charts/chart1/${testDate1}`).set(
      {
        "index" :  new Date(),
        "chartDate" : testDate1,
        "count" : this.chartForm1.value.countChart1
      }
    );
  }

  saveChart2() {
    this.testDate = this.chartForm2.value.dateChart2;
    console.log(this.datePipe.transform(this.testDate, 'MMMM d, y'));
    console.log(this.datePipe.transform(this.testDate, 'd'));
    const testDate1 = this.datePipe.transform(this.testDate, 'MMMM d, y');
    this.afs.doc(`COVID19/charts/chart2/${testDate1}`).set(
    // this.afs.doc(`COVID19/chart2`).set({}
      {
        // "index" : this.datePipe.transform(this.testDate, 'd'),
        "index" :  new Date(),
        "chartDate" : testDate1,
        "count" : this.chartForm2.value.countChart2
      }
    );
  }

  saveTable() {
    this.testDate = this.tableForm.value.tableVersion;
    const testDate1 = this.datePipe.transform(this.testDate, 'MMMM d, y');
    this.afs.doc(`COVIDtable/${this.tableForm.value.states}`).set(
      // this.afs.doc(`COVIDtable/${testDate1}/States/${this.tableForm.value.states}`).set(
      this.tableForm.value
    );
  }
}
