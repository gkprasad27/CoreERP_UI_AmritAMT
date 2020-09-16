import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { String } from 'typescript-string-operations';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-purchasingperson',
  templateUrl: './purchasingperson.component.html',
  styleUrls: ['./purchasingperson.component.scss']
})

export class PurchasingpersonComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glList: any;
    emplist: any;
    purchaseTypeList: any;
    pcgroupList: any;
  constructor(
    private addOrEditService: AddOrEditService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PurchasingpersonComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      purchasePerson: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      purchaseGroup: [null],
      purchaseTypes: [null]
     
    });


    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['purchasePerson'].disable();
    }

  }

  ngOnInit() {
    this.getEmployeeData();
    this.getPurchaseGroupData();
    this.getPurchaseTypeData();
  }
  getEmployeeData() {
    const getEmployeeUrl = String.Join('/', this.apiConfigService.getEmployeeList);
    this.apiService.apiGetRequest(getEmployeeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.emplist = res.response['emplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getPurchaseGroupData() {
    const getPurchaseGroupUrl = String.Join('/', this.apiConfigService.getPurchaseGroupList);
    this.apiService.apiGetRequest(getPurchaseGroupUrl)
      .subscribe(
        response => {
          const res = response.body
          console.log(res);
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.pcgroupList = res.response['PCGroupsList'];
            }
          }
          this.spinner.hide();
        });
  }

  getPurchaseTypeData() {
    const getPurchaseTypeUrl = String.Join('/', this.apiConfigService.getPurchasingtypeList);
    this.apiService.apiGetRequest(getPurchaseTypeUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.purchaseTypeList = res.response['purchaseTypeList'];
            }
          }
          this.spinner.hide();
        });
  }



  get formControls() { return this.modelFormData.controls; }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['purchasePerson'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['purchasePerson'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
