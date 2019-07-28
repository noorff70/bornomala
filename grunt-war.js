module.exports = function ( grunt ) {
    grunt.loadNpmTasks( 'grunt-war' );
 
    var taskConfig = {
        war: {
            target: {
                options: {
                    war_verbose: true,
                    war_dist_folder: 'web',           
                    war_name: 'studyaid',            
                    webxml_webapp_version: '2.5', 
                    war_extras: [{filename: 'WEB-INF/ibm-web-ext.xml', data: '<?xml version="1.0" encoding="UTF-8"?><web-ext xmlns="http://websphere.ibm.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://websphere.ibm.com/xml/ns/javaee http://websphere.ibm.com/xml/ns/javaee/ibm-web-ext_1_1.xsd" version="1.1"> <reload-interval value="3"/> <context-root uri="/TPCS-Mobile" /> <enable-directory-browsing value="false"/> <enable-file-serving value="true"/> <enable-reloading value="true"/> </web-ext>'}],
                    webxml_display_name: 'studyaid WAR'
                },
                files: [
                   {
                        expand: true,
                        cwd: 'dist',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    };
 
    grunt.initConfig( taskConfig );
};