import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {



  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  navItems = [];



  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    route: ActivatedRoute
  ) {
    this.commonService.routeParam = route.snapshot.routeConfig.path;
    commonService.showNavbar.next(true);
  }

  ngOnInit() {
    this.getMenuList();
  }

  getMenuList() {
    let obj = JSON.parse(localStorage.getItem("user"));

    const getMenuUrl = String.Join('/', this.apiConfigService.getMenuUrl, obj.role);
    this.apiService.apiGetRequest(getMenuUrl)
      .subscribe(
        menu => {
          this.spinner.hide();
          this.navItems = menu.body["response"];
          this.spinner.hide();
        });
  }

  ngAfterViewInit() {
    this.commonService.appDrawer = this.appDrawer;
  }

 
}
