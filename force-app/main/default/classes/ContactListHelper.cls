public with sharing class ContactListHelper {


    @AuraEnabled(cacheable=True)
    public static List<Contact> getContacts(){
        return [SELECT Id, Name, FirstName, LastName, urlprofile__c, Photourl__c, AccountId, account.name, Phone, Email FROM Contact LIMIT 1000];
    }

    @AuraEnabled(cacheable=True)
    public static List<Contact> searchContact(String searchString){
        List<List<SObject>> contacts = [FIND :searchString IN ALL FIELDS RETURNING Contact(Id, Name, FirstName, LastName, 
            Email, Phone, account.name)];

            return (List<Contact>) contacts[0];
    }

    @AuraEnabled
    public static void deleteContacts(List<Id> contactIds){
        if(contactIds.size()>0){
            delete [SELECT Id FROM Contact WHERE Id in: contactIds];
        }
    }
}