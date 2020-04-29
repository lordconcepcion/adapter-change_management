// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.

    //const options = {
    //    url: 'https://dev70735.service-now.com/',
    //    username: 'admin',
    //    password: '1Drls4HtxSRU'
    //};

    /* this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    }); */



    this.connector = new ServiceNowConnector({
      url: 'https://dev70735.service-now.com/',
      username: 'admin',
      password: '1Drls4HtxSRU',
      serviceNowTable: 'change_request'
    });


  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
  }

/**
 * @memberof ServiceNowAdapter
 * @method healthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 *   Calls method emitOnline if external system is available.
 *
 * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
 *   that handles the response.
 */
healthcheck(callback) {
 this.getRecord((result, error) => {
   /**
    * For this lab, complete the if else conditional
    * statements that check if an error exists
    * or the instance was hibernating. You must write
    * the blocks for each branch.
    */
   if (error) {
     /**
      * Write this block.
      * If an error was returned, we need to emit OFFLINE.
      * Log the returned error using IAP's global log object
      * at an error severity. In the log message, record
      * this.id so an administrator will know which ServiceNow
      * adapter instance wrote the log message in case more
      * than one instance is configured.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing the error seen as an argument
      * for the callback's errorMessage parameter.
      */
        this.emitOffline();
        log.error(`ServiceNow: healthcheck Error - ID: ${this.id} ${JSON.stringify(error)}`);
        if( callback ) {
            callback(null, error);
        }
        //return error;

   } else {
     /**
      * Write this block.
      * If no runtime problems were detected, emit ONLINE.
      * Log an appropriate message using IAP's global log object
      * at a debug severity.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing this function's result
      * parameter as an argument for the callback function's
      * responseData parameter.
      */
        this.emitOnline()
        log.debug(`ServiceNow: healthcheck successful - ID: ${this.id} Error: ${JSON.stringify(result)}`);
        if( callback ) {
            callback(result, null);
        }
        //return result;
   }
 });
}

  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.error(`ServiceNow: Instance is unavailable.  ID: ${this.id}`);
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info(`ServiceNow: Instance is available.  ID: ${this.id}`);
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */
        this.connector.get((data, error) => {
            if (error) {
                callback(null, error);
            }     
            else {
                if (data.hasOwnProperty('body')) {
                    var data_body = (JSON.parse(data.body));
                    var body_count = data_body.result.length;
                    var changeTicket = [];

                    for(var index = 0; index < body_count; index += 1) {
                        var singleChangeTicket = (JSON.parse(data.body).result);
                        changeTicket.push({ "change_ticket_number" : singleChangeTicket[index].number, 
                                        "active" : singleChangeTicket[index].active, 
                                        "priority" : singleChangeTicket[index].priority,
                                        "description" : singleChangeTicket[index].description, 
                                        "work_start" : singleChangeTicket[index].work_start, 
                                        "work_end" : singleChangeTicket[index].work_end,
                                        "change_ticket_key" : singleChangeTicket[index].sys_id
                                        });
                    } 
                callback(changeTicket, error); 
                }
            } 
        });
    }    
    

  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's post() method.
     * Note how the object was instantiated in the constructor().
     * post() takes a callback function.
     */
    this.connector.post((data, error) => {
            if (error) {
                //console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
                callback(data, error);
            } 
            else {
               /* if ( data.hasOwnProperty('body') ) {
                    var data_body = (JSON.parse(data.body).result);
                    
                    var changeTicket = {};
                    changeTicket = ({  "change_ticket_number" : data_body.number, 
                                        "active" : data_body.active, 
                                        "priority" : data_body.priority,
                                        "description" : data_body.description,
                                        "work_start" : data_body.work_start,
                                        "work_end" : data_body.work_end,
                                        "change_ticket_key" : data_body.sys_id
                                    });
                    callback( changeTicket, error); 
                } */
                if (data.hasOwnProperty('body')) {
                    var changeTicket = {};
                    var result_array = (JSON.parse(data.body).result);
                    changeTicket = ({"change_ticket_number" : result_array.number, "active" : result_array.active, "priority" : result_array.priority,
                                   "description" : result_array.description, "work_start" : result_array.work_start, "work_end" : result_array.work_end,
                                   "change_ticket_key" : result_array.sys_id});
                    callback(changeTicket, error); 
                 } 




            }          
        });
  }

}
module.exports = ServiceNowAdapter;

function main(){
    console.log(`\nFrom main() function`);
    var test_ServiceNowAdapter = new ServiceNowAdapter();
    // test_ServiceNowAdapter.getRecord();
    // test_ServiceNowAdapter.connect();
    //console.log(`\ntest_ServiceNowAdapter.connect() Complete`); 

    
    test_ServiceNowAdapter.getRecord( (data, error) => {
        console.log(`\nResponse returned from GET data JSON.stringify request:${JSON.stringify(data)}`);
        console.log(`\nResponse returned from GET error JSON.stringify request:${JSON.stringify(error)}`);
    // console.log(`\nResponse returned from GET JSON.parse request:${data}`);
    //console.log(`Change Ticket: ${data[0].change_ticket_number}`);

    });

    
    test_ServiceNowAdapter.postRecord( (data, error) => {
            console.log(`\nResponse returned from POST data JSON.stringify request:${JSON.stringify(data)}`);
            console.log(`\nResponse returned from POST error JSON.stringify request:${JSON.stringify(error)}`);

    }); 


}
main();