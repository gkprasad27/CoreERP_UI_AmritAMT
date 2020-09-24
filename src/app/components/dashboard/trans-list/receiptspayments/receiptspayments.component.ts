import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddOrEditService } from '../../comp-list/add-or-edit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
@Component({
  selector: 'app-receiptspayments',
  templateUrl: './receiptspayments.component.html',
  styleUrls: ['./receiptspayments.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class ReceiptspaymentsComponent implements OnInit {

  formData: FormGroup;
  routeEdit = '';
  bpList = [];
  tableData = [];
  dynTableProps: any;
  bpgLists: any;
  companyList = [];
  branchList = [];
  voucherClassList = [];
  voucherTypeList = [];
  transactionTypeList = ['Cash', 'Bank']
  natureofTransactionList = ['Receipts', 'Payment'];
  accountList = [];
  accountFilterList = [];
  glAccountList = [];
  indicatorList = [{ id: 'Debit', text: 'Debit' }, { id: 'Credit', text: 'Credit' }];
  profitCenterList = [];
  bpTypeList = [];
  segmentList = [];
  costCenterList = [];
  taxCodeList = [];
  functionaldeptList = [];
  purchaseinvoice = [];
  amount = [];
  date = [];
  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private addOrEditService: AddOrEditService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }
  }

  onbpChange() {
    this.bpgLists = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('bpcategory').value)) {
      let data = this.bpTypeList.find(res => res.code == this.formData.get('bpcategory').value);
      this.bpgLists = this.bpList.filter(res => res.bptype == data.code);
    }
  }

  ngOnInit() {
    this.formDataGroup();
    this.getCompanyList();
    this.formData.controls['voucherNumber'].disable();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      company: [null, [Validators.required]],
      branch: [null, [Validators.required]],
      voucherClass: [null],
      voucherType: [null, [Validators.required]],
      voucherDate: [new Date()],
      postingDate: [new Date()],
      period: [null],
      voucherNumber: [null, [Validators.required]],
      transactionType: [null, [Validators.required]],
      natureofTransaction: [null, [Validators.required]],
      account: [null],
      accountingIndicator: [null],
      referenceNo: [null],
      referenceDate: [null],
      profitCenter: [null],
      segment: [null],
      narration: [null],
      addWho: [null],
      editWho: [null],
      addDate: [null],
      editDate: [null],
      amount: [null, [Validators.required]],
      chequeNo: [null],
      chequeDate: [null],
      bpcategory: [null, [Validators.required]],
      partyAccount: [null, [Validators.required]]
    });
  }

  tablePropsFunc() {
    return {
      tableData: {
        id: {
          value: 0, type: 'autoInc', width: 10, disabled: true
        },
        checkAll:
        {
          value: false, type: 'checkbox'
        },

        partyInvoiceNo: {
          value: null, type: 'number', width: 150
        },
        partyInvoiceDate: {
          // value: null, type: 'dropdown', list: this.date, id: 'date', text: 'date', displayMul: true, width: 100
          value: new Date(), type: 'datepicker', width: 100
        },
        dueDate: {
          value: new Date(), type: 'datepicker', width: 100
        },
        invoiceAmount: {
          //value: null, type: 'dropdown', list: this.amount, id: 'amount', text: 'amount', displayMul: true, width: 100
          value: 0, type: 'number', width: 75
        },
        memoAmount: {
          value: 0, type: 'number', width: 75
        },
        clearedAmount: {
          value: 0, type: 'number', width: 75
        },
        balanceDue: {
          value: 0, type: 'number', width: 75
        },
        notDue: {
          value: 0, type: 'number', width: 75
        },
        adjustmentAmount: {
          value: 0, type: 'number', width: 75
        },
        discount: {
          value: 0, type: 'number', width: 75
        },
        writeOffAmount: {
          value: 0, type: 'number', width: 75
        },
        discountGl: {
          value: null, type: 'dropdown', list: this.glAccountList, id: 'id', text: 'text', displayMul: true, width: 100
        },
        writeOffGl: {
          value: null, type: 'dropdown', list: this.glAccountList, id: 'id', text: 'text', displayMul: true, width: 100
        },

        narration: {
          value: null, type: 'text', width: 150
        },
        // delete: {
        //   type: 'delete', width: 10
        // }
      },
      formControl: {}
    }
  }

  getreceiptpaymentDetail(val) {
    const cashDetUrl = String.Join('/', this.apiConfigService.getPaymentsReceiptsDetail, val);
    this.apiService.apiGetRequest(cashDetUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              //console.log( res.response['paymentreceiptMasters']);
              //console.log( res.response['paymentreceiptDetail']);
              this.formData.setValue(res.response['paymentreceiptMasters']);
              this.addOrEditService.sendDynTableData({ type: 'edit', data: res.response['paymentreceiptDetail'] });
              this.formData.disable();
              this.accountSelect();
              this.onbpChange();
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.accountFilterList = res.response['glList'];
              this.glAccountList = res.response['glList'].filter(resp => resp.taxCategory != 'Cash' || resp.taxCategory != 'Bank' || resp.taxCategory != 'Control Account');
            }
          }
          this.getfunctionaldeptList();
        });
  }

  accountSelect() {
    this.accountList = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('transactionType').value)) {
      this.accountList = this.accountFilterList.filter(resp => resp.taxCategory == this.formData.get('transactionType').value);
    }
  }

  puchaseinvoiceselect() {
    let data = [];
    let newData = [];
    if (!this.commonService.checkNullOrUndefined(this.formData.get('partyAccount').value)) {
      data = this.functionaldeptList.filter(resp => resp.id == this.formData.get('partyAccount').value);
    }
    if (data.length) {
      console.log(data, this.tablePropsFunc());
      data.forEach((res, index) => {
        newData.push(this.tablePropsFunc().tableData);
        newData[index].invoiceAmount.value = res.amount;
        newData[index].dueDate.value = res.date;
        newData[index].partyInvoiceNo.value = res.invoino;
      })
    }
    //
    this.addOrEditService.sendDynTableData({ type: 'add', data: newData, removeEmptyRow: 0 });
    this.tableData = newData;
  }

  getfunctionaldeptList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getpurchaseinvoiceList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.functionaldeptList = res.response['purchaseinvoiceList'];
            }
          }
          this.getTaxRatesList();
        });
  }

  getTaxRatesList() {
    const taxCodeUrl = String.Join('/', this.apiConfigService.getTaxRatesList);
    this.apiService.apiGetRequest(taxCodeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.profitCenterList = res.response['profitCenterList'];
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.segmentList = res.response['segmentList'];
            }
          }
          this.getPartnerTypeList();
        });
  }

  getPartnerTypeList() {
    const costCenUrl = String.Join('/', this.apiConfigService.getPartnerTypeList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpTypeList = res.response['ptypeList'];
            }
          }
          this.getbpList();
        });
  }

  getbpList() {
    const costCenUrl = String.Join('/', this.apiConfigService.getBPList);
    this.apiService.apiGetRequest(costCenUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.bpList = res.response['bpList'];
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
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.costCenterList = res.response['costcenterList'];
            }
          }
          this.dynTableProps = this.tablePropsFunc();
          if (this.routeEdit != '') {
            this.getreceiptpaymentDetail(this.routeEdit);
          }
        });
  }


  voucherTypeSelect() {
    //debugger;
    //alert(this.formData.get('voucherType').value);
    const record = this.voucherTypeList.find(res => res.voucherTypeId == this.formData.get('voucherType').value)
    this.formData.patchValue({
      voucherClass: !this.commonService.checkNullOrUndefined(record) ? record.voucherClass : null
    })
  }

  voucherNoCalculate() {
    this.formData.patchValue({
      voucherNumber: null
    })
    if (!this.commonService.checkNullOrUndefined(this.formData.get('voucherType').value)) {
      const voucherNoUrl = String.Join('/', this.apiConfigService.getVoucherNumber, this.formData.get('voucherType').value);
      this.apiService.apiGetRequest(voucherNoUrl)
        .subscribe(
          response => {
            this.spinner.hide();
            const res = response.body;
            if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!this.commonService.checkNullOrUndefined(res.response)) {
                this.formData.patchValue({
                  voucherNumber: !this.commonService.checkNullOrUndefined(res.response['VoucherNumber']) ? res.response['VoucherNumber'] : null
                })
              }
            }
          });
    }
  }

  emitColumnChanges(data) {
    if (data.column == 'adjustmentAmount') {
      this.loopTableData(data);
    }

    console.log(data)
  }

  loopTableData(row) {
    const dublicateRow = [...row.data];
    let flag = false;
    // let checkAjectAmount = 0;
    // for (let r = 0; r < row.data.length; r++) {
      // if (row.column == 'adjustmentAmount' && r == row.index) {
      if (row.column == 'adjustmentAmount') {
        if (+row.data[row.index].adjustmentAmount.value > +row.data[row.index].invoiceAmount.value) {
          this.alertService.openSnackBar(`AdjustmentAmount can't be more than invoiceAmount`, Static.Close, SnackBar.error);
          row.data[row.index].adjustmentAmount.value = 0;
          flag = true;
          // break;
        }
        // checkAjectAmount = checkAjectAmount + (+row.data[r].adjustmentAmount.value);
        // if (checkAjectAmount == +this.formData.get('amount').value) {
        //   this.alertService.openSnackBar(`AdjustmentAmount can't be same as total amount`, Static.Close, SnackBar.error);
        //   row.data[row.index].adjustmentAmount.value = 0;
        //   flag = true;
        //   break;
        // }
      }

    // }
    if (flag) {
      this.spinner.show();
      this.addOrEditService.sendDynTableData({ type: 'add', data: dublicateRow });
    }
  }

  emitTableData(data) {
    this.tableData = data;
    console.log(this.tableData)
  }

  back() {
    this.router.navigate(['dashboard/transaction/receiptspayments'])
  }

  checkAjectAmount() {
    let adjustmentAmount = 0;
    if (this.tableData.length) {
      this.tableData.forEach(res => {
        if (res.adjustmentAmount) {
          adjustmentAmount = adjustmentAmount + (+res.adjustmentAmount)
        }
      });
      if (adjustmentAmount > +this.formData.get('amount').value) {
        this.alertService.openSnackBar(`AdjustmentAmount can't be same as total amount`, Static.Close, SnackBar.error);
      }
      return (adjustmentAmount == +this.formData.get('amount').value) ? false : true;
    }
    return true;
  }

  save() {
    if (this.tableData.length == 0) {
      return;
    }
    this.savePaymentsReceipts();
  }

  return() {
    const addCashBank = String.Join('/', this.apiConfigService.returnCashBank, this.routeEdit);
    this.apiService.apiGetRequest(addCashBank).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          }
          this.spinner.hide();
        }
      });
  }

  reset() {
    this.tableData = [];
    this.formData.reset();
    this.formData.controls['voucherNumber'].disable();
    this.addOrEditService.sendDynTableData(this.tableData);
  }

  savePaymentsReceipts() {
    debugger;
    this.formData.controls['voucherNumber'].enable();
    const addCashBank = String.Join('/', this.apiConfigService.addPaymentsReceipts);
    const requestObj = { pcbHdr: this.formData.value, pcbDtl: this.tableData };
    this.apiService.apiPostRequest(addCashBank, requestObj).subscribe(
      response => {
        const res = response.body;
        if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.response)) {
            this.alertService.openSnackBar('Payments Receipts created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }
}
