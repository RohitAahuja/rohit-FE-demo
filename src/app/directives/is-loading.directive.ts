import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

@Directive({
  selector: '[isLoading]'
})
export class IsLoadingDirective {
  loadingFactory: ComponentFactory<LoaderComponent>;
  loadingComponent: ComponentRef<LoaderComponent>;

  @Input()
  set isLoading(loading: boolean) {
    console.log('loading', loading);
    this.vcRef.clear();

    if (loading) {
      this.loadingComponent = this.vcRef.createComponent(this.loadingFactory);
    }
    else {
      this.vcRef.createEmbeddedView(this.templateRef);
    }
  }

  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {
    this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);
  }
}
