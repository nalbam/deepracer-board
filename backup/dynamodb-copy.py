import os
import sys
import time

from boto.dynamodb2.exceptions import ValidationException
from boto.dynamodb2.fields import HashKey, RangeKey
from boto.dynamodb2.layer1 import DynamoDBConnection
from boto.dynamodb2.table import Table
from boto.exception import JSONResponseError

if len(sys.argv) != 3:
    print("Usage: %s <SOURCE_TABLE> <DESTNATION_TABLE>" % sys.argv[0])
    sys.exit(1)

src_name = sys.argv[1]
dst_name = sys.argv[2]

region = os.getenv("AWS_DEFAULT_REGION", "ap-northeast-2")

DynamoDBConnection.DefaultRegionName = region
ddbc = DynamoDBConnection()

# source table
try:
    src_logs = Table(src_name, connection=ddbc)
    src_logs.describe()
except JSONResponseError:
    print("Table [%s] does not exist." % src_name)
    sys.exit(1)

print("# Read from [%s]." % src_name)
src_table = ddbc.describe_table(src_name)["Table"]

hash_key = ""
range_key = ""
for schema in src_table["KeySchema"]:
    attr_name = schema["AttributeName"]
    key_type = schema["KeyType"]
    if key_type == "HASH":
        hash_key = attr_name
    elif key_type == "RANGE":
        range_key = attr_name

# destnation table
try:
    dst_logs = Table(
        dst_name, connection=ddbc, schema=[HashKey(hash_key), RangeKey(range_key),]
    )
    dst_logs.describe()
except JSONResponseError:
    # create table
    schema = []

    if hash_key != "":
        schema.append(HashKey(hash_key))

    if range_key != "":
        schema.append(RangeKey(range_key))

    print("# Create table [%s]." % dst_name)
    dst_logs = Table.create(dst_name, connection=ddbc, schema=schema,)
    time.sleep(3)

    while ddbc.describe_table(dst_name)["Table"]["TableStatus"] != "ACTIVE":
        time.sleep(2)

# copy data
print("# Copy to [%s]." % dst_name)
for item in src_logs.scan():
    new_item = {}

    if hash_key != "":
        new_item[hash_key] = item[hash_key]

    if range_key != "":
        new_item[range_key] = item[range_key]

    for k in item.keys():
        if k in [hash_key, range_key]:
            continue
        new_item[k] = item[k]

    # print(new_item)

    try:
        dst_logs.use_boolean()
        dst_logs.put_item(new_item, overwrite=True)
    except ValidationException as ex:
        print(ex)
    except JSONResponseError as ex:
        print(ex)

print("# Done.")
