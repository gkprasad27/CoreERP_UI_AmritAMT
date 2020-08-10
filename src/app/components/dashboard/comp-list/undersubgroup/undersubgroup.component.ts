import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { AddOrEditService } from '../add-or-edit.service';

@Component({
  selector: 'app-undersubgroup',
  templateUrl: './undersubgroup.component.html',
  styleUrls: ['./undersubgroup.component.scss']
})

export class UndersubGroupComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  glAccgrpList: any;
  getAccSubGrpList: any;
  glAccNameList: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<UndersubGroupComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      accountGroupId: [null,[Validators.required]],
      accountGroupName: [null, [Validators.required]],
      nature: [null, [Validators.required]],
      narration: [null],
      affectGrossProfit: [null],
      groupUnder: [null],
      Undersubaccount: [null]
    });

    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['accountGroupId'].disable();
      this.getGLUnderGroupList();
      this.getAccountNamelist();
    }
  }

  ngOnInit() {
    this.getglAccgrpList();
  }

  getglAccgrpList() {
    const getglAccgrpList = String.Join('/', this.apiConfigService.getglAccgrpList);
    this.apiService.apiGetRequest(getglAccgrpList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.glAccgrpList = res.response['GLAccGroupList'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountNamelist() {
    const getAccountNamelist = String.Join('/', this.apiConfigService.getAccountNamelist, this.modelFormData.get('nature').value);
    this.apiService.apiGetRequest(getAccountNamelist)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.glAccNameList = res.response['GetAccountNamelist'];
            }
          }
          this.spinner.hide();
        });
  }

  getGLUnderGroupList() {
    const getGLUnderGroupList = String.Join('/', this.apiConfigService.getGLUnderGroupList, this.modelFormData.get('groupUnder').value);
    this.apiService.apiGetRequest(getGLUnderGroupList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.getAccSubGrpList = res.response['GetAccountSubGrouplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountSubGrouplist() {
    const getAccountSubGrouplist = String.Join('/', this.apiConfigService.getAccountSubGrouplist,
      this.modelFormData.get('groupName').value);
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.glAccNameList = res.response['GLAccSubGroupList'];
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
    this.modelFormData.controls['accountGroupId'].enable();
    this.formData.item = this.modelFormData.value;
    (!isNullOrUndefined(this.formData.item.Undersubaccount)) ? this.formData.item.groupUnder = this.formData.item.Undersubaccount : null;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['accountGroupId'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
