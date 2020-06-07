/* ****************************-*- rajasekhar -*-*************************** */
/* Filename:    racsessioninfo.h                                             */
/* Author:      Rajasekhar Jonna (rajasekharj2@ami.com)                      */
/* Format:      Indent: Tab:4spaces                                          */
/* Created:     09/22/2006                                                   */
/* Modified:    09/22/2006                                                   */
/* Description: Headers/defines for RAC Session info library.      			 */
/* ************************************************************************* */

/** \file racsessioninfo.h
 *  \brief Headers and defines for RAC Session info library.
 *  
 */

#ifndef __RAC_SESSION_INFO_H__
#define __RAC_SESSION_INFO_H__

#include "coreTypes.h"

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif


/**
 * \mainpage Documentation for RAC Session Info library
 *	 
 * \author Rajasekhar Jonna (rajasekharj2@ami.com)
 *
 * \section Overview
 *
 * This library contains routines for registering the session information
 * with a global session database maintained by this library. It also contains 
 * routines for session manager to retrieve the session information from database. 
 *
 * An user can establish a session with the device using one of many provided intercaces.
 * Each session interface module, once a session is established can/must register the session details
 * with this database.
 *
 * The session database maintained by this library is a binary file pakced with series of records in it.
*/

/** \name Structures and defines used for session info database management */
/** \{ */

/** \brief racsessioninfo file path */
#define	RAC_SESSION_INFO_FILE			"/var/racsessioninfo"

/** \brief lockfile file path */
#define	RAC_SESSION_INFO_LOCK_FILE			"/var/infolock"

/** \brief Version for database structure */
#define	SESSION_INFO_VERSION			(1)

/** \brief Maximum number of session types */
#define		MAX_SESSION_TYPES			(32)
/** \brief Maximum length for Login ID */
#define		MAX_LOGIN_ID				(256)

/** \name List of session types 
 *  Following are the list of various session types provided to the user for login.
 */
	/** \{ */
    /** \brief Telnet session interface */
	#define SESSION_TYPE_TELNET			(2)
    /** \brief SSH session interface */
	#define SESSION_TYPE_SSH			(3)
	/** \brief Web session interface */
    #define SESSION_TYPE_WEB			(4)
	/** \brief SMASH session interface */
	//#define SESSION_TYPE_SMASH			(0x04)
	/** \brief WSMAN session interface */
	//#define SESSION_TYPE_WSMAN			(0x05)
	//these are internal session types that dont match with the rac extended command session types
	// instead we translate it at the outgoing point
	#define SESSION_TYPE_VKVM			(16)
	#define SESSION_TYPE_VMEDIA			(17)

	#define CONSOLE_TYPE_SMASH			(0x08)
	#define CONSOLE_TYPE_WEB			(0x04)
	#define CONSOLE_TYPE_VKVM			(0x02)
	#define CONSOLE_TYPE_VMEDIA			(0x01)
	/** \} */
#define SESSION_UNREGISTER_REASON_LOGOUT (0x01)
#define SESSION_UNREGISTER_REASON_EXPIRY (0x02)

/** 
 * \brief Session information record structure
 */
typedef struct {
	uint8		session_type; 		/** Session type used for login */
	time_t		login_time;			/** Login time stamp */
	uint8		client_ip[4];		/** IP address of the remote machine used for login */
	uint8		console;			/** Associated console */
	uint8		login_id_len;		/** Length of the login id */
	uint8		login_id[MAX_LOGIN_ID];		/** Login ID */
}PACKED ipmi_session_info_record_t;


/** 
 * \brief Session information record structure
 */
typedef struct {
	uint32		racsession_id;		/** Unique identifier for the session */
	uint8		session_type; 		/** Session type used for login */
	time_t		login_time;			/** Login time stamp */
	uint8		client_ip[4];		/** IP address of the remote machine used for login */
	uint8		console;			/** Associated console */
	uint8		login_id_len;		/** Length of the login id */
	uint8		login_id[MAX_LOGIN_ID];		/** Login ID */
	uint8		delete_record;		/** Private field. set to 1 in order to delete this record during cleanup */
	uint8		reserved[16];		/** Private field. Reserved for future use */
}PACKED session_info_record_t;

/**
 * \brief Session info database file header
 * 
 * This structure can be found in the begining of database file. The data in this structure
 * is used for quick info such as number of logins in each interface. For detailed info,
 * the whole database has to be read.
 */
typedef struct {
	uint16	session_info_version; /** session info database version */
	uint32  session_id_counter;		  /** Session ID counter */
	uint16  total_records;		  /** Total records in the dabase */
	uint16	active_sessions;	  /** Total valid records that are not marked for deletion */
	uint8	sess_type_logins[MAX_SESSION_TYPES]; /** Number of logins in each session type */	
	uint8	reserved[64];			/**Private field. Reserved for future use.*/	
}PACKED session_info_header_t;
/** \} */

/** \name API to register sessions with the database*/
/** \{ */

/** \brief Register a session with the session database.
 * 
 * Registers the given session with the session datbase. On success, the function will allot 
 * a 32-bit unique value which the caller must use while unregistering the session.
 * 
 * 
 * \param session_type	Session type
 * \param client_ip		IP address of the client
 * \param client_ip_len	length given client_ip
 * \param console		Associated console
 * \param login_id_len	length of login id
 * \param login_id		Login ID
 * \param session_id 	Holds the value of session id that is used to uniquely identify a session record.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 * \note (For developers)The parameter list might have to be updated if there is 
 * any change in the session info record structure
 *
 */
int racsessinfo_register_session( uint8 session_type/*in*/,
											char*		client_ip/*in*/,
											uint8		client_ip_len,/*in*/
											uint8		console/*in*/,
											char*		login_id/*in*/,
											uint8		login_id_len/*in*/,
											uint32 *session_id/*out*/);


/** \brief Register a session with the session database
 * 
 * Registers the given session with the session datbase. On success, the function will allot 
 * a 32-bit unique value which the caller must use while unregistering the session.
 * 
 * \param record Pointer to the record buffer that holds the session information.
 *
 * \param session_id Holds the value of session id that is used to uniquely identify a session record.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 */
int racsessinfo_register_session_byrecord(session_info_record_t *record/*in*/, uint32 *session_id/*out*/);

/** \} */

/** \name API to unregister, delete and cleanup sessions from the database 
 *
 * As the records are stored in a sequence, deleting a record at some random position 
 * requires to read all the records to memory, delete the specified record and then
 * write back all remaining records to the database. This whole operation not only takes
 * lot of reads and writes but also takes cpu time.
 *
 * To minimize this overhead, a delete record will not be physically deleted from disk 
 * but will be marked for deletion. If the number of such records that are marked for 
 * deletion exceeds DEL_RECORDS_LIMIT , then a whole database cleanup will be done which 
 * removes the deleted records physically from the disk.
 *
 * Records that are marked for deletion are ignored during database read operations.
 *
 * This may take a bit more disk space than required but the performance will improve.
 * 
 * The value of DEL_RECORDS_LIMIT can be changed to vary between effective 
 * space usage and effective performance.
 *
 */
/** \{ */

/** \brief Maximum number of records that can be marked for deletion before they are purged */
#define		DEL_RECORDS_LIMIT		(16)

/** \brief Unregister a session in the session database
 * 
 * Unregisters the given session in session datbase. This will actually mark the
 * session record for deletion and then will check the number of such records that are marked
 * for deletion. If the number exceeds DEL_RECORDS_LIMIT, it will call racsessinfo_cleanup
 * 
 * \param session_id Holds the value of session id that is used to uniquely identify a session record.
 * \param reason - reason for session unregister can be logout
 * or timeout
 *
 * \retval -1 on failure
 * \retval 0 on success
 *
 */
int racsessinfo_unregister_session(uint32 session_id,int reason);

/** \brief purge the database
 * 
 * Purges all the records that are already marked for deletion
 * 
 * \retval value of 'errno' on failure
 * \retval ENODATA if session_id not found
 * \retval 0 on success
 *
 */
int racsessinfo_purge();

/** \brief Cleanup the database
 * 
 * cleans up the database
 * 
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 */
int racsessinfo_cleanup();

/** \} */

/** \name API to read records from database file */
/** \{ */

/** \brief Read all the records from database 
 * 
 * Reads all the records from datbase file. While reading the records, the datbase file is locked.
 * It allocates required memory in session_info_records param to fit the read records and stores the
 * records in it. The caller is responsible for deallocating the memory once finished using it.
 * The total number of records read is updated in total_records parameter passed to the function call.
 *
 * \param session_info_records The buffer where the read records are stored. The user is responsible
 * in dellocating this memory after using it.
 * \param hdr Pointer to session database header 
 * \param total_records The total number of records that are read.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 * \warning The caller is responsible to deallocate the memory in session_info_records. 
*/
int racsessinfo_getallrecords(session_info_record_t **session_info_records/*out*/, 
								session_info_header_t *hdr/*out*/, 
								uint32 *total_records/*out*/);

/** \brief Read all the records from database in IPMI defined structure
 * 
 * Reads all the records from datbase file
 *
 * \param ipmi_session_info_records The buffer where the read records are stored. The user is responsible
 * in dellocating this memory after using it.
 * \param total_records The total number of records that are read.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 * \warning The caller is responsible to deallocate the memory in session_info_records. 
*/
int racsessinfo_ipmi_getallrecords(ipmi_session_info_record_t **session_info_records/*out*/, 
									uint32 *total_records/*out*/);

/*just like the above function but gives back raw records as well and caller has to free it*/
int racsessinfo_raw_and_ipmi_getallrecords(/*@null@*/ipmi_session_info_record_t **session_info_records/*out*/,
   													 session_info_record_t** raw_session_info_records/*out*/,
											uint32 *total_records/*out*/);

/** \brief Read records from database that are logged in with the given session type
 * 
 * Reads the records from datbase file for a given session type. While reading the records, the 
 * datbase file is locked. It allocates required memory in session_info_records param to fit the 
 * read records and stores the records in it. The caller is responsible for deallocating the memory 
 * once finished using it. The total number of records read is updated in total_records parameter 
 * passed to the function call.
 *
 * \param session_info_records Pointer to buffer where the read records are stored. The user is responsible
 * for dellocating this memory after using it.
 * \param hdr Pointer to session database header 
 * \param total_records The total number of records that are read.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
 * \warning The caller is responsible to deallocate the memory that is allocated for session_info_records. 
*/
int racsessinfo_sesstype_getrecords(uint8 session_type/*in*/, session_info_record_t **session_info_records/*out*/, 								session_info_header_t *hdr/*out*/, 
							uint32 *total_records/*out*/);

/** \brief Read session database header
 * 
 * Reads session database header. Database header contains some quick information like total 
 * number of active sessions and number of sessions with each session type. 
 * This call will not read the whole database file instead it will read only the database header.
 *
 * \param hdr Pointer to the session header buffer.
 *
 * \retval value of 'errno' on failure
 * \retval 0 on success
 *
*/
int racsessinfo_getsessionhdr(session_info_header_t *hdr/*out*/);

/** \brief Reads session record from database for a given session id.
 * 
 * Reads the session record identified by the given session id.
 *
 * \param session_id Session ID that uniquely identifies record in the database.
 * \param session_info_record Pointer to the session record buffer.
 *
 * \retval value of 'errno' on failure
 * \retval ENODATA if session_id not found.
 * \retval 0 on success
 *
*/
int racsessinfo_getsessionrecord(uint32 session_id/*in*/,  session_info_record_t *session_info_record/*out*/);

/** \} */


#ifdef __GNUC__
#else
#define PACKED
#pragma pack(  )
#endif




#endif



