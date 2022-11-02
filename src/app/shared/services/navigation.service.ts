import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  svgIcon?: string; // UI Lib icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;  // Material icon name
  svgIcon?: string; // UI Lib icon name
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  iconMenu: IMenuItem[] = [  
    {
      name: 'INVOICES',
      type: 'link',
      icon  : 'receipt_long',
      state: 'facturas/listado-facturas',
    },
    {
      name: 'Proformas',
      type: 'link',
      icon  : 'description',
      state: 'proformas/listado-proformas',
    },
    {
      name: 'CUSTOMERS',
      type: 'link',
      icon  : 'person',
      state: 'distribuidorarf/customers',
    },
    {
      name: 'PROVIDERS',
      type: 'link',
      icon  : 'flight_land',
      state: 'distribuidorarf/providers',
    },
    {
      name: 'INVENTORY',
      type: 'dropDown',
      icon: 'shopping_cart',
      state: 'distribuidorarf',
      sub: [
        { name: 'PRODUCTS', state: 'products' },
        { name: 'BRANCHES', state: 'branches' },
        { name: 'CATEGORIES', state: 'categories' },
        { name: 'KARDEX', state: 'kardex' },
        { name: 'LOTS', state: 'lots' },
        // { name: 'DETAIL', state: 'detalle/122kj' },
      ]
    },
    // {
    //   name: 'Blank',
    //   type: 'link',
    //   svgIcon: 'ulb_server',
    //   state: 'others/blank',
    // },
    // {
    //   name: 'Pricing',
    //   type: 'link',
    //   svgIcon: 'ulb_server',
    //   state: 'others/pricing',
    // },
    {
      name: 'DOC',
      type: 'extLink',
      tooltip: 'Documentation',
      icon: 'library_books',
      state: 'http://demos.ui-lib.com/egret-doc/'
    }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();
  constructor() {}

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    this.menuItems.next(this.iconMenu);
    
  }
}
