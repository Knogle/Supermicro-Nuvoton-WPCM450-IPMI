SUBDIRS = drivers apps libs

all: subdirs

subdirs:
	for n in $(SUBDIRS); do $(MAKE) -C $$n all|| exit 1; done

install:
	for n in $(SUBDIRS); do $(MAKE) -C $$n install || exit 1; done

clean:
	for n in $(SUBDIRS); do $(MAKE) -C $$n clean; done


