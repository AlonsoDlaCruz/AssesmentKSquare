import { LightningElement, api, wire} from 'lwc';
import LightningDatatable from 'lightning/datatable';
import getContacts from "@salesforce/apex/ContactListHelper.getContacts"
import searchContact from "@salesforce/apex/ContactListHelper.searchContact"
import {NavigationMixin, CurrentPageReference} from 'lightning/navigation';
import Email from '@salesforce/schema/Contact.Email';
//import {registerListener, unregisterAllListeners} from 'c/pubsub';


const ACTIONS = [{label: 'Delete', name: 'delete'}]


const columns=[{label: 'Name', type:'button', fieldName: 'Name', typeAttributes: {label: {fieldName: 'Name'}, variant: 'base'}},
    {label: 'Email', fieldName: 'Email', type:'email'},
    {label:'Phone', fieldName:'Phone', type: 'text'},
];

// function clickhandler(){
//     console.log('Button has been pressed');
// }
 

export default class RelatedContactsMainCmp extends LightningElement{
    @api accountid;
    @api contactid;
    @api selectedcontactid;

    columns=columns;
    contacts;
    wiredContacts;
    selectedContacts;
    baseData;
 

    get selectedContactsLen(){
        if(this.selectedContacts==undefined) return 0;
        return this.selectedContacts.length;
    }

    @wire(getContacts)
    contactsWire(result){
        this.wiredContacts=result;
        if(result.data){
            //handle data
            this.contacts = result.data.map((row) =>{
                return this.mapContacts(row);
            })
            this.baseData = this.contacts
        }

        if(result.error){
            console.error(result.error);
        }
    }

    mapContacts(row){
        var accountName ='';
        var accountLink='';
        if(row.AccountId!=undefined){
            accountLink = `/${row.AccountId}`;
            accountName=row.Account['Name'];
        }
        
        return {...row, 
            Name: `${row.Name}`,
        };
    }


    async searchHandler(event){
        if(event.target.value== ""){
            this.contacts = this.baseData
        }else if(event.target.value.length > 2){
            const searchContacts = await searchContact({searchString: event.target.value})

            this.contacts=searchContacts.map(row =>{
                return this.mapContacts(row);
            })
        }
    }



    renderedCallback(){
        if (this._hasRendered) {
            return;
        }
    
        const table = this.template.querySelector('lightning-datatable');
        table.addEventListener(
            'click',
            (e) => { console.log(e.target.fieldName+' was clicked.'); }
        );
            
        this._hasRendered = true;
    }

    
  
    
}