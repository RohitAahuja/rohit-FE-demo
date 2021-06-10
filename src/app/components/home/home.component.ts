import { Component, Inject, NgZone, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../../models';
import { CustomerService, AuthenticateService } from '../../services';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { BarChartData, GeoChartData, PieChartData } from 'src/app/constants';

function animateBullet(circle, chart) {
  let animation = circle.animate([{ property: "scale", from: 1 / chart.zoomLevel, to: 5 / chart.zoomLevel }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
  animation.events.on("animationended", function (event) {
    animateBullet(event.target.object, chart);
  })
}

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  private chart;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private authenticationService: AuthenticateService,
    private zone: NgZone
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }



  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


  renderGeoChart() {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdiv", am4maps.MapChart);
      chart.geodata = am4geodata_worldLow;
      chart.projection = new am4maps.projections.Miller();
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.exclude = ["AQ"];
      polygonSeries.useGeodata = true;
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.polygon.fillOpacity = 0.6;
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(0);
      let imageSeries = chart.series.push(new am4maps.MapImageSeries());
      imageSeries.mapImages.template.propertyFields.longitude = "longitude";
      imageSeries.mapImages.template.propertyFields.latitude = "latitude";
      imageSeries.mapImages.template.tooltipText = "{title}";
      imageSeries.mapImages.template.propertyFields.url = "url";

      let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
      circle.radius = 3;
      circle.propertyFields.fill = "color";
      circle.nonScaling = true;

      let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
      circle2.radius = 3;
      circle2.propertyFields.fill = "color";


      circle2.events.on("inited", function (event) {
        animateBullet(event.target, chart);
      })

      let colorSet = new am4core.ColorSet();
      imageSeries.data = GeoChartData.map(data => ({ ...data, color: colorSet.next() }));;
    });
  }

  renderPieChart() {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdiv", am4charts.PieChart);
      chart.data = PieChartData;
      chart.hiddenState.properties.opacity = 0;
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.radiusValue = "value";
      series.dataFields.category = "country";
      series.slices.template.cornerRadius = 6;
      series.colors.step = 3;

      series.hiddenState.properties.endAngle = -90;

      chart.legend = new am4charts.Legend();
    });
  }

  renderBarChart() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = BarChartData;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    chart.cursor = new am4charts.XYCursor();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();

    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}