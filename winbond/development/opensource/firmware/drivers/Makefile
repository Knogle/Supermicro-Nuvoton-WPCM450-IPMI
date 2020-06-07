SUBDIRS = i2c

all:  subdirs

# Module compilation is problematic for parallel make. Becuase if some module
# depends on symbols from another module, then the first module should be 
# compiled before the second module.
# In our case I2C drivers are dependent on each other. So till we figure out
# how to resolve this, parallel make is disabled (--jobs=1)

subdirs:
	@for n in $(SUBDIRS); do  cd $$n && $(MAKE) --jobs=1 all && cd -|| exit 1; done

install: all
	@for n in $(SUBDIRS); do  cd $$n && $(MAKE) --jobs=1 install && cd - || exit 1; done

clean:
	@for n in $(SUBDIRS); do  cd $$n && $(MAKE) --jobs=1 clean && cd -; done


