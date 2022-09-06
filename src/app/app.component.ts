import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { Asset, Title } from './models/models';
import { SuggestionService } from './services/suggestion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle = 'by Sony Pictures Entertainment';
  title = 'the at-home Runner typeahead exercise';
  requirements = [
    `We have supplied sample json in the data directory to return title suggestions for a typeahead input component you'll create.`,
    'Please build a client that returns the sample json, as you would any client interacting with a json API.',
    'When the user types 3 or more characters into the input, it should show an Angular Material typeahead/autocomplete dropdown.',
    `When the user makes a selection from the dropdown, a new element below the input should show the selection's full name. Feel free to be creative with your styles.`,
    'The selected titles should be removable.',
    'This mimics a form element in our application where users assign title metadata to assets, so if you would like to build something that replicates a form submission, feel free to come up with your own solution to how it "saves" the data.'
  ];

  options: any[] = [];
  filteredOptions!: Observable<any[]>;
  searchBox = new FormControl('');
  searchFormGroup: FormGroup = new FormGroup({
    searchBox: this.searchBox
  });

  selectedItems: Title[] = [];
  assetList: Asset[] = [];
  assetCounter: number = 0;
  isEditMode: boolean = false;
  selectedAssetId: number = 0;
  statusMessage: string = '';

  constructor(private svc: SuggestionService) { }

  ngOnInit(): void {
    this.filteredOptions = this.searchBox.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchTerm) => {
        if (searchTerm && searchTerm.length >= 3) {
          return this.svc.getSuggestions().pipe(
            map((data) => {
              this.options = [];
              if (data) {
                this.options = data.filter((item: Title) => item.full_name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1);
              }
              return this.options;
            })
          )
        } else {
          this.options = [];
          return of(this.options);
        }
      })
    )
  }

  onOptionSelected(selectedTitle: Title) {
    this.selectedItems.push(selectedTitle);
    this.showMessage(`Title id: ${selectedTitle.id} has been added to selected items`);
  }

  getOptionText(option: Title): string {
    return option.full_name;
  }

  removeItem(id: string) {
    this.selectedItems = this.selectedItems.filter(item => item.id !== id);
    this.showMessage(`Title id: ${id} has been removed`);
  }

  resetForm() {
    this.selectedItems = [];
    this.searchBox.setValue('');
    this.isEditMode = false;
  }

  saveAsset() {
    if (this.selectedItems.length > 0) {
      let id = 0;
      if (this.isEditMode) {
        id = this.selectedAssetId;
        this.assetList = this.assetList.filter(item => item.id !== id);
      } else {
        this.assetCounter += 1;
        id = this.assetCounter;
      }
      const newAsset: Asset = { id: id, titles: this.selectedItems, isSelected: false };
      this.assetList.push(newAsset);
      this.resetForm();
      this.showMessage(`Asset ${id} has been saved`);
    }
  }

  editMode(asset: Asset) {
    this.assetList.forEach(item => item.isSelected = false);
    asset.isSelected = true;
    this.isEditMode = true;
    this.selectedAssetId = asset.id;
    this.selectedItems = asset.titles;
    this.showMessage(`Asset ${this.selectedAssetId} has been loaded`);
  }

  showMessage(msg: string) {
    this.statusMessage = msg;
  }

  deleteAsset(asset: Asset) {
    this.assetList = this.assetList.filter(item => item.id !== asset.id);
    this.showMessage(`Asset ${asset.id} has been deleted`);
  }
}
