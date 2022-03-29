import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent} from './products.component'
import { FeaturedComponent} from './featured/featured.component'
import { NgModule } from '@angular/core';
const routes: Routes = [{
  path: '', component:ProductsComponent , children: [
    { path: 'featured', component: FeaturedComponent, pathMatch: 'full' }
  ]
}];

// export const ProductsRoutes = RouterModule.forChild(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutes { }
