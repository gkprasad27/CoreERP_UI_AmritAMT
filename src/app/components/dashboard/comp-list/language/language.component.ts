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
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})

export class LanguageComponent implements OnInit {
  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  employeesList: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private addOrEditService: AddOrEditService,
    public dialogRef: MatDialogRef<LanguageComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      languageCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      languageName: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.formData = { ...data };
    if (!isNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['languageCode'].disable();
    }

  }

  ngOnInit() {
  }
  getEmployeesList() {
    const getEmployeeList = String.Join('/', this.apiConfigService.getEmployeeList);
    this.apiService.apiGetRequest(getEmployeeList)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              console.log(res);
              this.employeesList = res.response['employeesList'];
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
    this.modelFormData.controls['languageCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.addOrEditService[this.formData.action](this.formData, (res) => {
      this.dialogRef.close(this.formData);
    });
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['languageCode'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
