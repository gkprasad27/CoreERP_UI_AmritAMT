import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddOrEditService } from '../../comp-list/add-or-edit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-journals',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})

export class JournalComponent implements OnInit {

  formData: FormGroup;
  routeEdit = '';

  debitValue = 0;
  creditValue = 0;

  tableData = [];
  dynTableProps: any;
  btList = [];
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  glAccountList = [];
  indicatorList = [{ id: 'Debit', text: 'Debit' }, { id: 'Credit', text: 'Credit' }];
  profitCenterList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    if (!isNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
    this.getfunctionaldeptList();
    this.formData.controls['voucherNumber'].disable();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null],
      branch: [null],
      voucherType: [null],
      voucherNumber: [null],
      voucherDate: [new Date()],
      postingDate: [new Date()],
      transactionType: [null],
      period: [null],
      referenceNo: [null],
      referenceDate: [null],
      ext: [null],
      ext1: [null],
      narration: [null],
      voucherClass: [null],
      accountingIndicator: [null],
      status: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null]
    });
  }

  tablePropsFunc() {
    return {
      tableData: {
        id: {
          value: 0, type: 'autoInc', width: 10, disabled: true
        },
        glaccount: {
          value: null, type: 'dropdown', list: this.glAccountList, id: 'id', text: 'text', displayMul: true, width: 150, primary: true
        },
        accountingIndicator: {
          value: null, type: 'dropdown', list: this.indicatorList, id: 'id', text: 'text', displayMul: false, width: 150, disabled: false
        },
        amount: {
          value: null, type: 'number', width: 75
        },
        taxCode: {
          value: null, type: 'dropdown', list: this.taxCodeList, id: 'taxRateCode', text: 'description', displayMul: false, width: 150
        },
        sgstamount: {
          value: null, type: 'number', disabled: true, width: 75
        },
        cgstamount: {
          value: null, type: 'number', disabled: true, width: 75
        },
        igstamount: {
          value: null, type: 'number', disabled: true, width: 75
        },
        ugstamount: {
          value: null, type: 'number', disabled: true, width: 75
        },
        referenceNo: {
          value: null, type: 'number'
        },
        referenceDate: {
          value: new Date(), type: 'datepicker', width: 100
        },
        functionalDept: {
          value: null, type: 'dropdown', list: this.functionaldeptList, id: 'code', text: 'description', displayMul: false, width: 150
        },
        profitCenter: {
          value: null, type: 'dropdown', list: this.profitCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        segment: {
          value: null, type: 'dropdown', list: this.segmentList, id: 'id', text: 'name', displayMul: false, width: 150
        },
        bttypes: {
          value: null, type: 'dropdown', list: this.btList, id: 'code', text: 'description', displayMul: false, width: 150
        },
        costCenter: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        narration: {
          value: null, type: 'text', width: 150, maxLength: 1000
        },
        workBreakStructureElement: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        netWork: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        orderNo: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        fundCenter: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        commitment: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        hSNSACCode: {
          value: null, type: 'dropdown', list: this.costCenterList, id: 'id', text: 'text', displayMul: false, width: 150
        },
        delete: {
          type: 'delete', width: 10
        }
      },
      formControl: {
        glaccount: [null, [Validators.required]]
      }
    }
  }

  getJVDetail(val) {
    const jvDetUrl = String.Join('/', this.apiConfigService.getJVDetail, val);
    this.apiService.apiGetRequest(jvDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.formData.setValue(res.response['jvMasters']);
              this.addOrEditService.sendDynTableData({ type: 'edit', data: res.response['JvDetail'] });
              this.formData.disable();
            }
          }
        });
  }

  getCompanyList() {
    const companyUrl = String.Join('/', this.apiConfigService.getCompanyList);
    this.apiService.apiGetRequest(companyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.companyList = res.response['companiesList'];
            }
          }
          this.getBranchList();
        });
  }

  getBranchList() {
    const branchUrl = String.Join('/', this.apiConfigService.getBranchList);
    this.apiService.apiGetRequest(branchUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.branchList = res.response['branchsList'];
            }
          }
          this.getTransVoucherClassList();
        });
  }

  getTransVoucherClassList() {
    const voucherClassList = String.Join('/', this.apiConfigService.getvocherclassList);
    this.apiService.apiGetRequest(voucherClassList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.voucherClassList = res.response['vcList'];
            }
          }
          this.getVoucherTypes();
        });
  }

  getVoucherTypes() {
    const voucherTypes = String.Join('/', this.apiConfigService.getVoucherTypesList);
    this.apiService.apiGetRequest(voucherTypes)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.voucherTypeList = res.response['vouchertypeList'];
            }
          }
          this.getGLAccountsList();
        });
  }

  getGLAccountsList() {
    const glAccUrl = String.Join('/', this.apiConfigService.getGLAccountsList);
    this.apiService.apiGetRequest(glAccUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
            }
          }
          this.getTaxRatesList();
        });
  }

  getfunctionaldeptList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getfunctionaldeptList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.functionaldeptList = res.response['fdeptList'];
            }
          }
        });
  }

  getTaxRatesList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.taxCodeList = res.response['TaxratesList'];
            }
          }
          this.getProfitCentersList();
        });
  }

  getProfitCentersList() {
    const profCentUrl = String.Join('/', this.apiConfigService.getProfitCentersList);
    this.apiService.apiGetRequest(profCentUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
            }
          }
          this.getBusienessTransactionTypeList();
        });
  }

  getBusienessTransactionTypeList() {
    const segUrl = String.Join('/', this.apiConfigService.getBusienessTransactionTypeList);
    this.apiService.apiGetRequest(segUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.btList = res.response['bpttList'];
            }
          }
          this.getSegments();
        });
  }

  getSegments() {
    const segUrl = String.Join('/', this.apiConfigService.getSegmentList);
    this.apiService.apiGetRequest(segUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.segmentList = res.response['segmentList'];
            }
          }
          this.getCostcenters();
        });
  }

  getCostcenters() {
    const costCenUrl = String.Join('/', this.apiConfigService.getCostCentersList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.costCenterList = res.response['costcenterList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getJVDetail(this.routeEdit);
          }
        });
  }

  voucherTypeSelect() {
    const record = this.voucherTypeList.find(res => res.id == this.formData.get('voucherType').value)
    this.formData.patchValue({
      voucherClass: !isNullOrUndefined(record) ? record.voucherClassName : null
    })
  }

  voucherNoCalculate() {
    this.formData.patchValue({
      voucherNumber: null
    })
    if (!isNullOrUndefined(this.formData.get('voucherType').value)) {
      const voucherNoUrl = String.Join('/', this.apiConfigService.getVoucherNumber, this.formData.get('voucherType').value);
      this.apiService.apiGetRequest(voucherNoUrl)
        .subscribe(
          response => {
            this.spinner.hide();
            const res = response.body;
            if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!isNullOrUndefined(res.response)) {
                this.formData.patchValue({
                  voucherNumber: !isNullOrUndefined(res.response['VoucherNumber']) ? res.response['VoucherNumber'] : null
                });
              }
            }
          });
    }
  }

  emitColumnChanges(data) {
    this.dataChange(data);
  }

  dataChange(row) {
    if (row.column == 'accountingIndicator' || row.column == 'glaccount') {
      if (row.data.length > 1) {
        row.data.map((res, index) => {
          if (index != 0 && !isNullOrUndefined(row.data[0].accountingIndicator.value)) {
            res.accountingIndicator.value = (row.data[0].accountingIndicator.value == 'Debit') ? 'Credit' : 'Debit';
            res.accountingIndicator.disabled = true;
          } else if(index != 0) {
            res.accountingIndicator.disabled = true;
          }
        })
      }
      this.addOrEditService.sendDynTableData({ type: 'add', data: row.data });
    }
    if (row.column == 'taxCode' || row.column == 'amount') {
      const code = row.data[row.index]['taxCode'].list.find(res => res.taxRateCode == row.data[row.index]['taxCode'].value);
      if (!isNullOrUndefined(code)) {
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
        row.data[row.index].igstamount.value = (row.data[row.index].amount.value * code.igst) / 100;
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.sgst) / 100;
        row.data[row.index].cgstamount.value = (row.data[row.index].amount.value * code.cgst) / 100;
        this.addOrEditService.sendDynTableData({ type: 'add', data: row.data });
      }
    }
  }

  emitTableData(data) {
    this.tableData = data;
  }

  checkCreditDebit() {
    this.debitValue = 0;
    this.creditValue = 0;
    if (!isNullOrUndefined(this.tableData)) {
      if (this.tableData.length) {
        this.tableData.forEach(res => {
          if (res.accountingIndicator == 'Debit') {
            this.debitValue = !isNullOrUndefined(parseInt(res.amount)) ? (this.debitValue + parseInt(res.amount)) : 0;
          }
          if (res.accountingIndicator == 'Credit') {
            this.creditValue = !isNullOrUndefined(parseInt(res.amount)) ? (this.creditValue + parseInt(res.amount)) : 0;
          }
        });
        return (this.debitValue == this.creditValue) ? false : true;
      }
    }
    return true;
  }


  back() {
    this.router.navigate(['dashboard/transaction/journals']);
  }

  save() {
    if (this.tableData.length == 0) {
      return;
    }
    this.saveJournal();
  }

  return() { }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    this.addOrEditService.sendDynTableData({ type: 'add', data: this.tableData });
  }

  saveJournal() {
    this.formData.controls['voucherNumber'].enable();
    const addJournal = String.Join('/', this.apiConfigService.addJournal);
    const requestObj = { journalHdr: this.formData.value, journalDtl: this.tableData };
    this.apiService.apiPostRequest(addJournal, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!isNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Journal created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }
}