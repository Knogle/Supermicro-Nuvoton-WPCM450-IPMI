/************************************************************************
 * **********************************************************************
 * ***																  ***
 * ***		(C)Copyright 2002-2005, American Megatrends Inc.		  ***
 * ***																  ***
 * ***			All Rights Reserved									  ***
 * ***																  ***
 * ***		    6145-F NorthBelt Parkway, Norcross					  ***
 * ***																  ***
 * ***			Georgia-30071, USA									  ***
 * ***																  ***
 * **********************************************************************
 * *********************************************************************/

/************************************************************************
 * $HEADER: $
 *
 * $Revision: 1.0
 *
 * $Date: 06/16/2006
 * **********************************************************************/

/*************************************************************************
 * 	@file		ceds.h
 * 	@author		Venkatesh Ramamurthy
 * 	@brief		CEDS Library Implementation
 *
 * 	Revision History:
 *
 * 	$Log:		Created on 09/21/2006
 *
 *  $Log:       Header file for CEDS API
 *
 ************************************************************************/

#ifndef _CEDS_H
#define _CEDS_H


#define MAX_DB_NAME			32
#define MAX_DB_TABLE_NAME	32	
#define MAX_DB_USER_NAME	16
#define MAX_DB_USER_PASSWD	32


#define	MAX_PATH_NAME		256

#define HASH_KEY_MAX	0x40

/*
 * Generic Query ID's
 * Query ID's 100 and above are specified by design input
 */
#define QUERY_ID_NO_QUERY		0
#define QUERY_ID_ALL_RECORDS	1
#define QUERY_ID_TIME_MATCH		2



#define QUERY_ID_VENDOR_BASE	100

#define TABLE_ID_VENDOR_BASE	1000


typedef int (*CedsSortFxn)(void *rec1, void *rec2, 
								u_int32_t context1, u_int32_t context2);

typedef enum _db_ecode_e
{
	DB_E_SUCCESS,
	DB_E_BAD_ENGINE_RESPONSE,
	DB_E_FILE_NOT_EXIST,
	DB_E_INVALID_DB_HEADER,
	DB_E_INCORRECT_VERSION,
	DB_E_RESOURCE_UNAVAILABLE,
	DB_E_IO_ERROR,
	DB_E_END_OF_RECORDS,
	DB_E_INVALID_PARAMS,
	DB_E_TABLE_NOT_FOUND,
	DB_E_INTERNAL_ERROR,
	DB_E_REC_NOT_FOUND,
	DB_E_INVALID_CRED,
	DB_E_JOURNAL_ALREADY_OPEN,
	DB_E_JOURNAL_CREATE,
	DB_E_JOURNAL_IO_ERROR,
	DB_E_MAX_DB_SIZE,
	DB_E_REQ_COMPACT,
	DB_E_LIMIT_REACHED
} db_ecode_e;

enum db_dt
{
	DT_INT,
	DT_LONG,
	DT_DOUBLE,
	DT_CHAR,
	DT_WCHAR,
	DT_STR,
	DT_WSTR,
	DT_ULONG,
	DT_FLOAT,
	DT_BLOB,
	DT_UINT
};

typedef struct _db_data_type
{
	union {
		int		i;
		long	l;
		double	d;
		char	c;
		char	*string;
		wchar_t	*wstring;
		wchar_t	wc;
		unsigned long	ul;
		float			f;
		unsigned int	u;
		unsigned char	*blob;
	};
	
	enum db_dt type;
	int length;
	int	offset;
} db_data_type_t;


typedef unsigned long db_handle_t;

typedef struct _db_credentials 
{
	char *user;
	char *challenge;
} db_cred_t;

typedef struct _rec_loc_s
{
	u_int16_t	page_nr;
	u_int32_t	recno;
	u_int32_t	done;
	u_int16_t	hkey;
} rec_loc_t;


#define RESULT_PARTIAL_DATA		0x1
#define RESULT_FULLY_READ		0x2
#define RESULT_DATA_VALID		0x4

typedef struct _db_result_set 
{
	u_int32_t rec_count;
	u_int32_t curr_index;
	u_int16_t rec_size;
	rec_loc_t recloc;
	db_handle_t dbhandle;
	u_int16_t	query_id;
	u_int8_t	params; 
	db_data_type_t *param_list;
	void *session;
	u_int8_t *cache;
	u_int32_t cache_len;
	void **record_array;
	u_int32_t list_len;
	u_int32_t flag;
	u_int8_t	*curr_index_recptr;
	CedsSortFxn SortFxn;
	u_int32_t SortContext1;
	u_int32_t SortContext2;
} db_resultset_t;

typedef struct db_server_session db_session_t;


typedef int
(*ceds_match_query)(db_session_t *client, 
					db_handle_t dbhandle, 	
					u_int16_t	query_id,	
					db_data_type_t *param, 	
					u_int16_t	param_count, 	
					void		*recptr,	
					u_int16_t	rsize,
					void		*rechead);

typedef int
(*hashkey_query)(db_session_t *client, 
					db_handle_t dbhandle, 	
					u_int16_t	query_id,	
					db_data_type_t *param, 	
					u_int16_t	param_count);

typedef int
(*hashkey_record)(db_session_t *client, 
					db_handle_t dbhandle, 	
					void *recptr,	
					u_int16_t	rsize);

struct db_server_session
{
//	u_int32_t db_cache_sem;
	ceds_match_query match_query;
	hashkey_query	 hkey_query;
	hashkey_record	 hkey_record;
	u_int32_t db_cache_shmid;
	u_int8_t *db_cache_shmaddr;
	u_int8_t *db_map_mem;
	u_int8_t *db_rec_ptr;
	db_data_type_t *db_param_list;
	char	dbpath[MAX_PATH_NAME];
	char	logpath[MAX_PATH_NAME];
} ;


typedef struct db_session_info
{
	char *dbdir;
	char *logdir;
	ceds_match_query match_query;
	hashkey_query	 hkey_query;
	hashkey_record	 hkey_record;
} db_session_info_t;

/*
 * External Client API's
 */

db_ecode_e
ceds_create(db_session_t *dbsess, 
				char *db, 
				char *table,
				u_int16_t	db_id,
				u_int16_t	tab_id, 
				int size,
				db_cred_t *logonInfo, 
				db_handle_t *handle);

db_ecode_e
ceds_connect(db_session_t *session, 
				char *db, 
				u_int16_t	tab_id, 
				db_cred_t *logonInfo, 
				db_handle_t *handle);

db_ecode_e
ceds_exec_query(db_session_t *dbsess, 
					db_handle_t handle,
					u_int16_t	query_id,
					u_int8_t	params, 
					db_data_type_t *param_list,
					db_resultset_t *result
					);

db_ecode_e
ceds_update_rec_int(db_session_t *dbsess, 
					db_handle_t handle,
					u_int16_t	query_id,
					u_int8_t	params, 
					db_data_type_t *param_list,
					void *rec,
					int recsize
					);

db_ecode_e
ceds_del_rec_int(db_session_t *dbsess, 
					db_handle_t handle,
					u_int16_t	query_id,
					u_int8_t	params, 
					db_data_type_t *param_list,
					void *rec,
					int recsize
					);

db_ecode_e
ceds_add_rec_int(db_session_t *dbsess, 
					db_handle_t handle,
					void *rec,
					int recsize,
					u_int32_t *recid
					);




void *
ceds_get_next_record(db_resultset_t *resultset,u_int32_t *record_id);

void
ceds_set_record_index(db_resultset_t *resultset, 
							int index);

db_ecode_e
ceds_get_max_records(db_session_t *dbsess, 
					db_handle_t handle, 
					u_int32_t *maxreclimit);

db_ecode_e
ceds_set_max_records(db_session_t *dbsess, 
					db_handle_t handle, 
					u_int32_t maxreclimit);

db_ecode_e
ceds_get_records_count(db_session_t *dbsess, 
					db_handle_t handle, 
					u_int32_t *records);

void 
ceds_setup_query_cache(db_resultset_t *resultset, 
							void *cache, 
							u_int32_t length);

void 
ceds_clear_query_cache(db_resultset_t *resultset);


int 
ceds_preallocate_query_cache(db_resultset_t *resultset, 
									 u_int32_t max_records,
									 u_int16_t length);

void 
ceds_free_preallocated_query_cache(db_resultset_t *resultset);


db_ecode_e
ceds_close(db_session_t *dbsess, 
			db_handle_t handle);


void 
ceds_set_wstr_value(db_data_type_t *param,
					wchar_t *string, 
					int len);

void 
ceds_set_str_value(db_data_type_t *param,
					char *string);


void 
ceds_set_float_value(db_data_type_t *param,
					float val);

void 
ceds_set_uint_value(db_data_type_t *param,
					unsigned int val);

void 
ceds_set_ulong_value(db_data_type_t *param,
					unsigned long val);

void 
ceds_set_wchar_value(db_data_type_t *param,
					wchar_t val);

void 
ceds_set_char_value(db_data_type_t *param,
					char val);

void 
ceds_set_double_value(db_data_type_t *param,
					double val);

void 
ceds_set_long_value(db_data_type_t *param,
					long val);

void 
ceds_set_int_value(db_data_type_t *param,
					int val);


void 
ceds_set_blob(db_data_type_t *param,
					unsigned char *string, 
					int length);


void 
ceds_sort_result(db_resultset_t *resultset, 
						CedsSortFxn SortFxn, 
						u_int32_t context1,
						u_int32_t context2);


u_int32_t 
ceds_get_record_id(void *rechead);

u_int16_t 
ceds_get_record_len(void *rechead);

void * 
ceds_get_record(void *rechead);

int 
db_get_tab_id(db_handle_t dbhandle);


#define db_get_param_str(param,index) ((u_int8_t *)param + param[index].offset)
#define db_get_param_int(param,index) ((int)param[index].i)
#define db_get_param_float(param,index) ((float)param[index].i)
#define db_get_param_double(param,index) ((double)param[index].i)
#define db_get_param_blob(param,index) ((unsigned char *)param[index].blob)


#define ceds_add_rec(sess, handle, x, rid) ceds_add_rec_int((sess), (handle), (void *)x, sizeof(typeof(*x)), (rid))
#define ceds_del_rec(sess, handle, qid, params, list,  x) ceds_del_rec_int((sess), (handle), (qid), (params), (list), (void *)x, sizeof(typeof(*x)))
#define ceds_update_rec(sess, handle, qid, params, list, x) ceds_update_rec_int((sess), (handle), (qid), (params), (list), (void *)x, sizeof(typeof(*x)))

#define ceds_get_count_in_result(x) ((x)->rec_count)

db_session_t *db_open_session(db_session_info_t *sessparams);
int db_close_session(db_session_t *dbsession);


#endif /* _CEDS_H */
