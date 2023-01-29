SUPERVISOR_CONF_VERSION=0.2
 supervisord:
	cd lib/code-server/model; \
	cp -r supervisord-conf supervisord-conf-$(SUPERVISOR_CONF_VERSION); \
	tar zcvf supervisord-conf-$(SUPERVISOR_CONF_VERSION).tar.gz supervisord-conf-$(SUPERVISOR_CONF_VERSION); \
	rm -rf supervisord-conf-$(SUPERVISOR_CONF_VERSION)
