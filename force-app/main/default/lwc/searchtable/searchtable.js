import { LightningElement, track, wire, api  } from 'lwc';
import getContacts from "@salesforce/apex/ContactListHelper.getContacts";
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
import searchContact from "@salesforce/apex/ContactListHelper.searchContact"
//import {NavigationMixin, CurrentPageReference} from 'lightning/navigation';

export default class searchtable extends LightningElement {
    @api recordId;

    @track data = [];
    @track error;
    @track selectedCon;
    ogContacts =[];
    contactName = ''
    contactAccount =''
    contactPhone =''
    contactPhoto='https://www.creativefabrica.com/wp-content/uploads/2020/08/03/Gold-Pattern-Design-Graphics-4831869-1-580x435.png'

// Getting Contacts using Wire Service
    @wire(getContacts)
    contacts(result) {
        if (result.data) {
            this.data = result.data;
            this.ogContacts = result.data;
            this.error = undefined;


        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }


    showDetail(event){
        let namevalue=event.target.value
        console.log(event.target.value + ' Clicked')
        
        this.fetchdetail(namevalue);
    }

    fetchdetail(nameVal){
        for(let j = 0; j<this.ogContacts.length; j++){
            if(nameVal == this.ogContacts[j].Name){
                console.log(this.ogContacts[j]);
                this.contactName=this.ogContacts[j].Name;
                this.contactAccount=this.ogContacts[j].Account.Name;
                this.contactPhone=this.ogContacts[j].Phone;
                if(this.ogContacts[j].Photourl__c == null ){
                    this.contactPhoto='https://century21agcoplus.com/wp-content/uploads/2019/10/no-photo-available-male.jpg';
                }else{
                    this.contactPhoto=this.ogContacts[j].Photourl__c;
                }
                
            }
            
        }
    }

    async searchHandler(event){
        if(event.target.value.length == ""){
            this.data = this.ogContacts;
        }else if(event.target.value.length > 2){
            const searchContacts = await searchContact({searchString: event.target.value})

            this.data=searchContacts;
        }
    }
 

        // ToNewContact(){
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes:{
    //             objectApiName: 'Contact', 
    //             actionName: 'new'
    //         }
    //     })
    // }
}