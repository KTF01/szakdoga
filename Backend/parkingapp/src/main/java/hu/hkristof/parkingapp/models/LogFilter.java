package hu.hkristof.parkingapp.models;

import java.sql.Timestamp;

import hu.hkristof.parkingapp.LogAction;

public class LogFilter {
	private String text;
	private LogAction action;
	private Timestamp startTime;
	private Timestamp endTime;
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Timestamp getStartTime() {
		return startTime;
	}
	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	public Timestamp getEndTime() {
		return endTime;
	}
	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
	public LogAction getAction() {
		return action;
	}
	public void setAction(LogAction action) {
		this.action = action;
	}
	
	
}
